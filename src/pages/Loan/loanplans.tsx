import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from 'react-router';
import { useState } from 'react';

export default function LoanPlans() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const openEditModal = (plan: any) => {
    setEditingPlan(plan);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setEditingPlan(null);
    setIsEditOpen(false);
  };

  return (
    <div className="p-6">
      {/* Title + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Loan Plans</h1>

        <Link to="/loan/add-loan-plan" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md">
          <Plus size={18} />
          ADD NEW
        </Link>
      </div>

      {/* Card Container */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-purple-50 text-gray-700 text-sm dark:bg-gray-700 dark:text-gray-200">
              <th className="px-4 py-3 font-semibold">PLAN NAME</th>
              <th className="px-4 py-3 font-semibold">MIN. AMOUNT</th>
              <th className="px-4 py-3 font-semibold">MAX. AMOUNT</th>
              <th className="px-4 py-3 font-semibold">PER INSTALLMENT</th>
              <th className="px-4 py-3 font-semibold">TOTAL INSTALLMENT</th>
              <th className="px-4 py-3 font-semibold">STATUS</th>
              <th className="px-4 py-3 font-semibold">ACTION</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b dark:border-gray-700">
              <td className="px-4 py-4 text-gray-800 font-medium dark:text-gray-100">
                Education Loan
              </td>

              <td className="px-4 py-4 dark:text-gray-200">$100.00</td>
              <td className="px-4 py-4 dark:text-gray-200">$500.00</td>
              <td className="px-4 py-4 dark:text-gray-200">10%</td>
              <td className="px-4 py-4 dark:text-gray-200">12 Times</td>

              <td className="px-4 py-4 dark:text-gray-200">
                <span className="px-4 py-1 rounded-full bg-teal-500 text-white text-sm">
                  Active
                </span>
              </td>

              <td className="px-4 py-4 flex items-center gap-3">
                <button onClick={() => openEditModal({
                  name: 'Education Loan',
                  minAmount: '100.00',
                  maxAmount: '500.00',
                  interestRate: '10',
                  installmentInterval: '30',
                  totalInstallment: '12',
                  loanProcessingFee: '5',
                  fields: [
                    { label: 'ID Number', type: 'text', required: true },
                    { label: 'NID Card', type: 'file', required: true },
                    { label: 'Write about yourself', type: 'textarea', required: false },
                    { label: 'Gender', type: 'select', options: ['Male','Female','Others'], required: true },
                  ],
                  instructions: 'Please write something to the manager',
                  delayDays: '4',
                  delayCharge: '2',
                  featured: true,
                  status: 'Active',
                  badge: 'Best'
                })} className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700">
                  <Pencil size={18} />
                </button>
                <button className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-10">
          <div className="fixed inset-0 bg-blue/50" onClick={closeEditModal}></div>
          <div className="relative w-full max-w-6xl rounded bg-white p-6 shadow-lg dark:bg-gray-800 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold dark:text-white">Edit Loan Plan</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Plan Name: *</label>
                      <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.name} />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Min Amount:</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.minAmount} />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Max Amount:</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.maxAmount} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Interest Rate: *</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.interestRate} />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Installment Interval: *</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.installmentInterval} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Days</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Total Installment: *</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.totalInstallment} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Loan Processing Fee:</label>
                  <div className="flex items-center gap-2">
                    <input className="w-28 rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.loanProcessingFee} />
                    <select className="rounded border px-2 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option>%</option>
                      <option>$</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <button className="mb-3 rounded bg-purple-600 px-3 py-2 text-white">Add Field Option</button>
                <div className="space-y-2">
                  {editingPlan.fields.map((f: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input className="w-1/3 rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={f.label} />
                      <select className="w-1/3 rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={f.type}>
                        <option value="text">Input Text</option>
                        <option value="file">File upload</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                      </select>
                      <select className="w-1/6 rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={f.required ? 'Required' : 'Optional'}>
                        <option>Required</option>
                        <option>Optional</option>
                      </select>
                      <button className="ml-auto rounded-full bg-pink-500 px-2 py-1 text-white">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Loan Instructions:</label>
                <textarea className="mt-1 h-36 w-full rounded border p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.instructions}></textarea>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Charge will Apply if Delay: *</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.delayDays} />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Delay Charge: *</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.delayCharge} />
                    <select className="rounded border px-2 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option>$</option>
                      <option>%</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Badge:</label>
                  <input className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" defaultValue={editingPlan.badge} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 items-center">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Featured</label>
                  <div className="mt-1 flex gap-2">
                    <button className={`px-3 py-2 ${editingPlan.featured ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Yes</button>
                    <button className={`px-3 py-2 ${!editingPlan.featured ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>No</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Status</label>
                  <div className="mt-1 flex gap-2">
                    <button className={`px-3 py-2 ${editingPlan.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Active</button>
                    <button className={`px-3 py-2 ${editingPlan.status !== 'Active' ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Deactivate</button>
                  </div>
                </div>

                <div className="md:col-span-1 flex items-end justify-end">
                  <button className="w-full rounded bg-purple-600 px-4 py-3 text-white">Update Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
