import { useState, useEffect } from 'react';
import { fetchSettings, updateSettings, fetchCommission, updateCommission } from '../../../api/settings';

// Withdraw settings API integration
const fetchWithdrawSettings = async () => {
  const token = localStorage.getItem('ecommerce_token');
  if (!token) throw new Error('No auth token found');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };
  const res = await fetch('https://api.mastrokart.com/dashboard/withdraw-settings', requestOptions);
  if (!res.ok) throw new Error('Failed to fetch withdraw settings');
  return res.json();
};

// Withdraw settings update API integration
const updateWithdrawSettings = async (data: { min_amount: number; max_amount: number; min_days_between_requests: number }) => {
  const token = localStorage.getItem('ecommerce_token');
  if (!token) throw new Error('No auth token found');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const requestOptions: RequestInit = {
    method: 'PATCH',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow' as RequestRedirect,
  };
  const res = await fetch('https://api.mastrokart.com/dashboard/withdraw-settings/update', requestOptions);
  if (!res.ok) throw new Error('Failed to update withdraw settings');
  return res.json();
};
// Commission mapping for display
const shop_commission_settings = {
  commission_status: { 0: 'disabled', 1: 'enabled' },
  commission_type: { 0: 'percentage', 1: 'fixed_amount' },
  commission_charge: { 0: 'per_order', 1: 'per_item' },
  shop_registration_status: { 0: 'disabled', 1: 'enabled' }
};

// Status mapping for payment methods
const paymentStatusMap: Record<number, string> = { 0: 'Inactive', 1: 'Active' };

const tabs = [
  { key: 'company', label: 'Company Info' },
  { key: 'payment', label: 'Payment Setup' },
  { key: 'commission', label: 'Commission Settings' },
  { key: 'security', label: 'WithDraw Settings' },
];

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState('company');
  const [settings, setSettings] = useState<any>(null);
  const [commission, setCommission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Withdraw settings state
  type WithdrawSettings = {
    min_amount: number;
    max_amount: number;
    min_days_between_requests: number;
  };
  const [withdrawSettings, setWithdrawSettings] = useState<WithdrawSettings | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  // Withdraw settings form state
  const [withdrawForm, setWithdrawForm] = useState<{
    min_amount: string;
    max_amount: string;
    min_days_between_requests: string;
  }>({
    min_amount: '',
    max_amount: '',
    min_days_between_requests: '',
  });
  const [withdrawSaving, setWithdrawSaving] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    business_model: '0',
    time_zone: '',
    payment_method_id: 1,
    status: 0,
  });

  // Commission form state
  const [commissionData, setCommissionData] = useState({
    commission_status: 0,
    commission_value: 0,
    commission_type: 0,
    commission_charge: 0,
    shop_registration_status: 1,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSettings(), fetchCommission()])
      .then(([settingsRes, commissionRes]) => {
        setSettings(settingsRes.data);
        setCommission(commissionRes.data);
        // Populate form with fetched data
        if (settingsRes.data?.company) {
          setFormData({
            company_name: settingsRes.data.company.company_name || '',
            company_email: settingsRes.data.company.company_email || '',
            company_phone: settingsRes.data.company.company_phone || '',
            business_model: String(settingsRes.data.company.business_model ?? '0'),
            time_zone: settingsRes.data.company.time_zone || '',
            payment_method_id: settingsRes.data.payment_methods?.[0]?.payment_method_id || 1,
            status: settingsRes.data.payment_methods?.[0]?.status ?? 0,
          });
        }
        if (commissionRes.data) {
          setCommissionData({
            commission_status: commissionRes.data.commission_status ?? 0,
            commission_value: commissionRes.data.commission_value ?? 0,
            commission_type: commissionRes.data.commission_type ?? 0,
            commission_charge: commissionRes.data.commission_charge ?? 0,
            shop_registration_status: commissionRes.data.shop_registration_status ?? 1,
          });
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch settings');
      })
      .finally(() => setLoading(false));
    // Fetch withdraw settings for Security tab
    setWithdrawLoading(true);
    setWithdrawError(null);
    fetchWithdrawSettings()
      .then((res) => {
        setWithdrawSettings(res.data);
        setWithdrawForm({
          min_amount: res.data?.min_amount !== undefined && res.data?.min_amount !== null ? String(res.data.min_amount) : '',
          max_amount: res.data?.max_amount !== undefined && res.data?.max_amount !== null ? String(res.data.max_amount) : '',
          min_days_between_requests: res.data?.min_days_between_requests !== undefined && res.data?.min_days_between_requests !== null ? String(res.data.min_days_between_requests) : '',
        });
        setWithdrawError(null);
      })
      .catch((err) => {
        setWithdrawError(err.message || 'Failed to fetch withdraw settings');
      })
      .finally(() => setWithdrawLoading(false));
  }, []);

  // Withdraw settings form handlers (must be top-level, not inside useEffect)
  const handleInputChangeWithdraw = (field: string, value: string) => {
    setWithdrawForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWithdrawSave = async () => {
    setWithdrawSaving(true);
    setWithdrawSuccess(null);
    setWithdrawError(null);
    try {
      const payload = {
        min_amount: Number(withdrawForm.min_amount),
        max_amount: Number(withdrawForm.max_amount),
        min_days_between_requests: Number(withdrawForm.min_days_between_requests),
      };
      const result = await updateWithdrawSettings(payload);
      setWithdrawSuccess(result.detail || 'Withdraw settings updated successfully');
      // Refresh withdraw settings after update
      const res = await fetchWithdrawSettings();
      setWithdrawSettings(res.data);
      setWithdrawForm({
        min_amount: res.data?.min_amount !== undefined && res.data?.min_amount !== null ? String(res.data.min_amount) : '',
        max_amount: res.data?.max_amount !== undefined && res.data?.max_amount !== null ? String(res.data.max_amount) : '',
        min_days_between_requests: res.data?.min_days_between_requests !== undefined && res.data?.min_days_between_requests !== null ? String(res.data.min_days_between_requests) : '',
      });
    } catch (err: any) {
      setWithdrawError(err.message || 'Failed to update withdraw settings');
    } finally {
      setWithdrawSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommissionChange = (field: string, value: string | number) => {
    setCommissionData((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // Handle toggling payment method status individually
  const handlePaymentStatusToggle = async (method: any, newStatus: number) => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Include all required fields along with payment method update
      await updateSettings({
        company_name: formData.company_name,
        company_email: formData.company_email,
        company_phone: formData.company_phone,
        business_model: formData.business_model,
        time_zone: formData.time_zone,
        payment_method_id: method.payment_method_id,
        status: newStatus,
      });
      setSuccessMessage('Payment method status updated successfully');
      // Refresh settings after update
      const res = await fetchSettings();
      setSettings(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update payment method status');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await updateSettings(formData);
      setSuccessMessage(result.detail || 'Settings updated successfully');
      // Refresh settings after update
      const res = await fetchSettings();
      setSettings(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCommissionSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await updateCommission(commissionData);
      setSuccessMessage(result.detail || 'Commission settings updated successfully');
      // Refresh commission after update
      const res = await fetchCommission();
      setCommission(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update commission settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue to-blue-800 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 gap-4 md:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-lg">Business Settings</h1>
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-5 py-2 rounded-full font-semibold transition-all duration-200 text-xs sm:text-sm shadow-md focus:outline-none ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105'
                    : 'bg-white/20 text-white hover:bg-blue-700/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center">
              {successMessage}
            </div>
          )}
          {loading ? (
            <div className="text-white text-center">Loading settings...</div>
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : (
            <>
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-300">Company Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-white/80 mb-1">Company Name</label>
                      <input
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        placeholder="Enter company name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Company Email</label>
                      <input
                        type="email"
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        placeholder="Enter company email"
                        value={formData.company_email}
                        onChange={(e) => handleInputChange('company_email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        placeholder="Enter phone number"
                        value={formData.company_phone}
                        onChange={(e) => handleInputChange('company_phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Business Model</label>
                      <select
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={formData.business_model}
                        onChange={(e) => handleInputChange('business_model', e.target.value)}
                      >
                        <option value="0" className='bg-blue'>Single Shop</option>
                        <option value="1" className='bg-blue'>Multi Shop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Time Zone</label>
                      <input
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        placeholder="Enter time zone"
                        value={formData.time_zone}
                        onChange={(e) => handleInputChange('time_zone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-300">Payment Method Setup</h2>
                  <div className="flex flex-col gap-4">
                    {Array.isArray(settings?.payment_methods) && settings.payment_methods.length > 0 ? (
                      settings.payment_methods.map((method: any) => (
                        <div key={method.payment_method_id} className="flex items-center justify-between bg-gradient-to-br from-blue-800/60 to-blue/60 rounded-xl p-4 sm:p-6 shadow-lg">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{method.method_name}</h3>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="accent-blue-400 scale-125"
                              checked={method.status === 1}
                              disabled={saving}
                              onChange={(e) => handlePaymentStatusToggle(method, e.target.checked ? 1 : 0)}
                            />
                            <span className="text-white">{paymentStatusMap[method.status] || 'Unknown'}</span>
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/70">No payment methods configured.</div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'commission' && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-300">Commission Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-white/80 mb-1">Commission Status</label>
                      <select
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={commissionData.commission_status}
                        onChange={(e) => handleCommissionChange('commission_status', e.target.value)}
                      >
                        <option value="0" className='bg-blue'>Disabled</option>
                        <option value="1" className='bg-blue'>Enabled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Commission Value</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        placeholder="Enter commission value"
                        value={commissionData.commission_value}
                        onChange={(e) => handleCommissionChange('commission_value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Commission Type</label>
                      <select
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={commissionData.commission_type}
                        onChange={(e) => handleCommissionChange('commission_type', e.target.value)}
                      >
                        <option value="0" className='bg-blue'>Percentage</option>
                        <option value="1" className='bg-blue'>Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1">Commission Charge</label>
                      <select
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={commissionData.commission_charge}
                        onChange={(e) => handleCommissionChange('commission_charge', e.target.value)}
                      >
                        <option value="0" className='bg-blue'>Per Order</option>
                        <option value="1" className='bg-blue'>Per Item</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-white/80 mb-1">Shop Registration Status</label>
                      <select
                        className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={commissionData.shop_registration_status}
                        onChange={(e) => handleCommissionChange('shop_registration_status', e.target.value)}
                      >
                        <option value="0" className='bg-blue'>Disabled</option>
                        <option value="1" className='bg-blue'>Enabled</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleCommissionSave}
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {saving ? 'Saving...' : 'Save Commission Settings'}
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="mt-2">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-4">Withdraw Settings</h3>
                    {withdrawSuccess && (
                      <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center">{withdrawSuccess}</div>
                    )}
                    {withdrawLoading ? (
                      <div className="text-white/80">Loading withdraw settings...</div>
                    ) : withdrawError ? (
                      <div className="text-red-400">{withdrawError}</div>
                    ) : (
                      <form
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        onSubmit={e => { e.preventDefault(); handleWithdrawSave(); }}
                      >
                        <div className="bg-white/10 rounded-lg p-4 border border-blue-400 text-white flex flex-col">
                          <label className="font-semibold mb-1">Min Amount</label>
                          <input
                            type="number"
                            min={0}
                            className="rounded px-2 py-1 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                            value={withdrawForm.min_amount}
                            onChange={e => handleInputChangeWithdraw('min_amount', e.target.value)}
                            required
                          />
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 border border-blue-400 text-white flex flex-col">
                          <label className="font-semibold mb-1">Max Amount</label>
                          <input
                            type="number"
                            min={0}
                            className="rounded px-2 py-1 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                            value={withdrawForm.max_amount}
                            onChange={e => handleInputChangeWithdraw('max_amount', e.target.value)}
                            required
                          />
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 border border-blue-400 text-white flex flex-col">
                          <label className="font-semibold mb-1">Min Days Between Requests</label>
                          <input
                            type="number"
                            min={0}
                            className="rounded px-2 py-1 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                            value={withdrawForm.min_days_between_requests}
                            onChange={e => handleInputChangeWithdraw('min_days_between_requests', e.target.value)}
                            required
                          />
                        </div>
                        <div className="md:col-span-3 flex justify-end mt-4">
                          <button
                            type="submit"
                            disabled={withdrawSaving}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {withdrawSaving ? 'Saving...' : 'Save Withdraw Settings'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
