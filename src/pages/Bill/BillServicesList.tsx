import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import { Link } from 'react-router';
import { useState } from 'react';

type Service = {
  id: number;
  name: string;
  code: string;
  type: string;
  status: 'Active' | 'Inactive';
};

const sampleServices: Service[] = [
  { id: 104, name: 'AIRTEL VTU', code: 'BIL100', type: 'Airtime', status: 'Active' },
  { id: 103, name: 'DSTV PAYMENT', code: 'BIL200', type: 'Cables', status: 'Active' },
  { id: 102, name: 'DSTV PAYMENT', code: 'BIL200', type: 'Cables', status: 'Active' },
  { id: 101, name: 'DSTV ZM', code: 'BIL200', type: 'Cables', status: 'Active' },
  { id: 100, name: 'MTN VTU', code: 'BIL132', type: 'Airtime', status: 'Active' },
  { id: 99, name: 'MTN VTU', code: 'BIL132', type: 'Airtime', status: 'Active' },
  { id: 98, name: 'MTN', code: 'BIL132', type: 'Airtime', status: 'Active' },
  { id: 66, name: 'MTN 100 MB DATA BUNDLE', code: 'BIL108', type: 'Data-bundle', status: 'Active' },
  { id: 75, name: 'MTN 11GB', code: 'BIL108', type: 'Data-bundle', status: 'Active' },
];

const BillServicesList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');
  const [charge, setCharge] = useState<number | ''>('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  function openEditModal(s: Service) {
    setEditingService(s);
    // populate defaults (mock values)
    setMinAmount(0);
    setMaxAmount(0);
    setCharge(0.03);
    setStatus(s.status);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingService(null);
  }

  function handleSave() {
    // Mock save: just log values and close modal. Replace with API call when ready.
    console.log('Saving service', {
      id: editingService?.id,
      minAmount,
      maxAmount,
      charge,
      status,
    });
    // feedback can be added here (toast)
    closeModal();
  }
  return (
    <div className="p-6">
      <PageMeta title="Bill Services | Admin" description="Manage bill services" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bill Services</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-white">List of available bill services</div>
            <div className="flex items-center gap-3">
              <Link to="/bill/import-services" className="rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Import Services</Link>
              <button className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-700">New Service</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-left">
                <th className="px-6 py-4 dark:text-white">Name</th>
                <th className="px-6 py-4 dark:text-white">Code</th>
                <th className="px-6 py-4 dark:text-white">Type</th>
                <th className="px-6 py-4 dark:text-white">Status</th>
                <th className="px-6 py-4 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleServices.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{s.name}</td>
                  <td className="px-6 py-4 dark:text-white">{s.code}</td>
                  <td className="px-6 py-4 dark:text-white">{s.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${s.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(s)} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white hover:bg-purple-700" title="Edit service">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden p-4">
          <div className="space-y-4">
            {sampleServices.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.type} • {s.code}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div><span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${s.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}>{s.status}</span></div>
                    <div>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white hover:bg-purple-700" title="Edit service">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer / pagination */}
        <div className="p-4 border-t flex items-center justify-between dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-white">Showing {sampleServices.length} entries</div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-sm dark:text-white">‹</button>
              <button className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-800 text-sm dark:text-white">1</button>
              <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-sm dark:text-white">2</button>
              <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-sm dark:text-white">›</button>
            </nav>
          </div>
        </div>
        {/* Edit modal */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
            <div className="relative w-full max-w-lg mx-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Service Limit & Charges</h3>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-200">Min Amount:</label>
                      <input type="number" value={minAmount as any} onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-200">Max Amount:</label>
                      <input type="number" value={maxAmount as any} onChange={(e) => setMaxAmount(e.target.value === '' ? '' : Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-200">Charge:</label>
                      <input type="number" step="0.01" value={charge as any} onChange={(e) => setCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-200">Status:</label>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => setStatus('Active')} className={`px-4 py-2 rounded-md ${status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}>Active</button>
                        <button onClick={() => setStatus('Inactive')} className={`px-4 py-2 rounded-md ${status === 'Inactive' ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-700'}`}>Inactive</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex items-center gap-3 justify-end dark:border-gray-800">
                  <button onClick={handleSave} className="rounded-md bg-purple-600 px-4 py-2 text-white">Save Changes</button>
                  <button onClick={closeModal} className="rounded-md bg-red-500 px-4 py-2 text-white">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillServicesList;
