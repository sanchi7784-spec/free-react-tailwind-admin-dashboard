import { useState, useEffect } from 'react';
import {
  fetchTaxes,
  createTax,
  updateTax,
  type Tax,
} from '../../../api/taxes';

export default function VatTax() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [formData, setFormData] = useState({
    tax_name: '',
    percentage: 0,
    status: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchTaxes();
      setTaxes(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load taxes';
      const errorStatus = err.status || 'Unknown';
      console.error('Error fetching taxes:', {
        message: errorMessage,
        status: errorStatus,
        detail: err.detail,
        fullError: err
      });
      setError(`Error ${errorStatus}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setEditingTax(null);
    setFormData({
      tax_name: '',
      percentage: 0,
      status: 1,
    });
    setShowModal(true);
  };

  const handleEdit = (tax: Tax) => {
    console.log('Editing tax:', tax);
    setEditingTax(tax);
    setFormData({
      tax_name: tax.tax_name,
      percentage: tax.percentage,
      status: tax.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (editingTax) {
        // Update existing tax
        const taxId = editingTax.id ?? editingTax.tax_id;
        if (!taxId) {
          throw new Error('Tax ID is missing');
        }
        const response = await updateTax(taxId, formData);
        alert(response.detail || 'Tax updated successfully');
      } else {
        // Create new tax
        const { status, ...createPayload } = formData;
        const response = await createTax(createPayload);
        alert(response.detail || 'Tax created successfully');
      }
      
      // Reload the list
      await loadTaxes();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save tax');
      alert(err.message || 'Failed to save tax');
      console.error('Error saving tax:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (tax: Tax) => {
    try {
      const taxId = tax.id ?? tax.tax_id;
      if (!taxId) {
        throw new Error('Tax ID is missing');
      }
      const newStatus = tax.status === 1 ? 0 : 1;
      const response = await updateTax(taxId, {
        tax_name: tax.tax_name,
        percentage: tax.percentage,
        status: newStatus,
      });
      alert(response.detail || 'Status updated successfully');
      await loadTaxes();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue to-purple-800 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-lg mb-4 md:mb-0">
            VAT & Tax Management
          </h1>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all"
          >
            + Add New Tax
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center">
            <div className="text-white text-lg">Loading taxes...</div>
          </div>
        ) : (
          /* Taxes Table */
          <div className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Tax Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Percentage (%)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {taxes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                        No taxes found. Click "Add New Tax" to create one.
                      </td>
                    </tr>
                  ) : (
                    taxes.map((tax) => (
                      <tr key={tax.id ?? tax.tax_id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{tax.tax_name}</td>
                        <td className="px-6 py-4 text-white/80">{tax.percentage}%</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(tax)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tax.status === 1
                                ? 'bg-green-500/20 text-green-300 border border-green-500'
                                : 'bg-red-500/20 text-red-300 border border-red-500'
                            }`}
                          >
                            {tax.status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(tax)}
                              className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm font-medium transition-all"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 via-blue to-purple-800 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingTax ? 'Edit Tax' : 'Add New Tax'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-1 text-sm">Tax Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 outline-none"
                  placeholder="e.g., GST, VAT, Sales Tax"
                  value={formData.tax_name}
                  onChange={(e) => handleInputChange('tax_name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white/80 mb-1 text-sm">Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 outline-none"
                  placeholder="0"
                  value={formData.percentage}
                  onChange={(e) => handleInputChange('percentage', Number(e.target.value))}
                />
              </div>
              {editingTax && (
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Status</label>
                  <select
                    className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 outline-none"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', Number(e.target.value))}
                  >
                    <option value={1} className="bg-blue">Active</option>
                    <option value={0} className="bg-blue">Inactive</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
