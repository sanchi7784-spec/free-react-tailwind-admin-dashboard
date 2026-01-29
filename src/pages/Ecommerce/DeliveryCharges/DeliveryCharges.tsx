import { useState, useEffect } from 'react';
import {
  fetchDeliveryCharges,
  createDeliveryCharge,
  updateDeliveryCharge,
  type DeliveryCharge,
} from '../../../api/deliveryCharges';

export default function DeliveryCharges() {
  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState<DeliveryCharge | null>(null);
  const [formData, setFormData] = useState({
    min_order_quantity: 0,
    max_order_quantity: 0,
    charge_amount: 0,
    status: 1,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDeliveryCharges();
  }, []);

  const loadDeliveryCharges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchDeliveryCharges();
      setDeliveryCharges(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load delivery charges';
      const errorStatus = err.status || 'Unknown';
      console.error('Error fetching delivery charges:', {
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
    setEditingCharge(null);
    setFormData({
      min_order_quantity: 0,
      max_order_quantity: 0,
      charge_amount: 0,
      status: 1,
    });
    setShowModal(true);
  };

  const handleEdit = (charge: DeliveryCharge) => {
    console.log('Editing charge:', charge);
    setEditingCharge(charge);
    setFormData({
      min_order_quantity: charge.min_order_quantity,
      max_order_quantity: charge.max_order_quantity,
      charge_amount: charge.charge_amount,
      status: charge.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (editingCharge) {
        // Update existing charge
        const chargeId = editingCharge.id ?? editingCharge.delivery_charge_id;
        if (!chargeId) {
          throw new Error('Delivery charge ID is missing');
        }
        const response = await updateDeliveryCharge(chargeId, formData);
        alert(response.detail || 'Delivery charge updated successfully');
      } else {
        // Create new charge
        const { status, ...createPayload } = formData;
        const response = await createDeliveryCharge(createPayload);
        alert(response.detail || 'Delivery charge created successfully');
      }
      
      // Reload the list
      await loadDeliveryCharges();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save delivery charge');
      alert(err.message || 'Failed to save delivery charge');
      console.error('Error saving delivery charge:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (charge: DeliveryCharge) => {
    try {
      const chargeId = charge.id ?? charge.delivery_charge_id;
      if (!chargeId) {
        throw new Error('Delivery charge ID is missing');
      }
      const newStatus = charge.status === 1 ? 0 : 1;
      const response = await updateDeliveryCharge(chargeId, {
        min_order_quantity: charge.min_order_quantity,
        max_order_quantity: charge.max_order_quantity,
        charge_amount: charge.charge_amount,
        status: newStatus,
      });
      alert(response.detail || 'Status updated successfully');
      await loadDeliveryCharges();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue to-blue-800 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-lg mb-4 md:mb-0">
            Delivery Charges Management
          </h1>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all"
          >
            + Add New Charge
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
            <div className="text-white text-lg">Loading delivery charges...</div>
          </div>
        ) : (
          /* Delivery Charges Table */
          <div className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Min Order Qty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Max Order Qty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Charge Amount (₹)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {deliveryCharges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/60">
                        No delivery charges found. Click "Add New Charge" to create one.
                      </td>
                    </tr>
                  ) : (
                    deliveryCharges.map((charge) => (
                      <tr key={charge.id ?? charge.delivery_charge_id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{charge.min_order_quantity}</td>
                        <td className="px-6 py-4 text-white/80">{charge.max_order_quantity}</td>
                        <td className="px-6 py-4 text-white/80">₹{charge.charge_amount}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(charge)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              charge.status === 1
                                ? 'bg-green-500/20 text-green-300 border border-green-500'
                                : 'bg-red-500/20 text-red-300 border border-red-500'
                            }`}
                          >
                            {charge.status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(charge)}
                              className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg text-sm font-medium transition-all"
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
          <div className="bg-gradient-to-br from-blue-900 via-blue to-blue-800 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingCharge ? 'Edit Delivery Charge' : 'Add New Delivery Charge'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Min Order Quantity</label>
                  <input
                    type="number"
                    className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="0"
                    value={formData.min_order_quantity}
                    onChange={(e) => handleInputChange('min_order_quantity', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Max Order Quantity</label>
                  <input
                    type="number"
                    className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                    placeholder="10"
                    value={formData.max_order_quantity}
                    onChange={(e) => handleInputChange('max_order_quantity', Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 mb-1 text-sm">Charge Amount (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/50 border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="50"
                  value={formData.charge_amount}
                  onChange={(e) => handleInputChange('charge_amount', Number(e.target.value))}
                />
              </div>
              {editingCharge && (
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Status</label>
                  <select
                    className="w-full rounded-lg px-4 py-2 bg-white/20 text-white border border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none"
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
