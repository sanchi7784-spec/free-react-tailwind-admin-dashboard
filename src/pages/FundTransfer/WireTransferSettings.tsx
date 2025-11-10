import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

type FieldOption = { id: number; name: string; type: string; validation: string };

const defaultOptions: FieldOption[] = [
  { id: 1, name: 'Account Name', type: 'text', validation: 'required' },
  { id: 2, name: 'Account Number', type: 'text', validation: 'required' },
  { id: 3, name: 'Full Name', type: 'text', validation: 'required' },
  { id: 4, name: 'Phone Number', type: 'text', validation: 'required' },
  { id: 5, name: 'SWIFT Code or IBAN Number', type: 'text', validation: 'required' },
];

const WireTransferSettings: React.FC = () => {
  const [charge, setCharge] = useState<number | ''>(10);
  const [chargeType, setChargeType] = useState('percentage');
  const [minimumTransfer, setMinimumTransfer] = useState<number | ''>(10);
  const [maximumTransfer, setMaximumTransfer] = useState<number | ''>(10000);
  const [dailyLimitAmount, setDailyLimitAmount] = useState<number | ''>(100000);
  const [dailyLimitCount, setDailyLimitCount] = useState<number | ''>(5);
  const [monthlyLimitAmount, setMonthlyLimitAmount] = useState<number | ''>(5000000);
  const [monthlyLimitCount, setMonthlyLimitCount] = useState<number | ''>(100);
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>(defaultOptions);
  const [instructions, setInstructions] = useState<string>('In this example, we retrieved the existing JSON data, modified it, and then saved it back to the database.');

  const addFieldOption = () => {
    const id = fieldOptions.length ? Math.max(...fieldOptions.map((f) => f.id)) + 1 : 1;
    setFieldOptions([...fieldOptions, { id, name: '', type: 'text', validation: 'required' }]);
  };

  const removeFieldOption = (id: number) => {
    setFieldOptions(fieldOptions.filter((f) => f.id !== id));
  };

  const updateFieldOption = (id: number, patch: Partial<FieldOption>) => {
    setFieldOptions(fieldOptions.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      charge,
      chargeType,
      minimumTransfer,
      maximumTransfer,
      dailyLimitAmount,
      dailyLimitCount,
      monthlyLimitAmount,
      monthlyLimitCount,
      fieldOptions,
      instructions,
    };
    console.log('Save Wire Transfer Settings payload:', payload);
    // TODO: call API to persist
    alert('Settings saved (mock)');
  };

  return (
    <>
      <PageMeta title="Wire Transfer Settings | Admin" description="Configure wire transfer settings" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wire Transfer Settings</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Charges:</label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="number" value={charge ?? ''} onChange={(e) => setCharge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <select value={chargeType} onChange={(e) => setChargeType(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Minimum Transfer Amount:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={minimumTransfer ?? ''} onChange={(e) => setMinimumTransfer(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">USD</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Maximum Transfer Amount:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={maximumTransfer ?? ''} onChange={(e) => setMaximumTransfer(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">USD</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Daily Limit Maximum Amount:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={dailyLimitAmount ?? ''} onChange={(e) => setDailyLimitAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">USD</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Daily Limit Maximum Count:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={dailyLimitCount ?? ''} onChange={(e) => setDailyLimitCount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">Times</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Monthly Limit Maximum Amount:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={monthlyLimitAmount ?? ''} onChange={(e) => setMonthlyLimitAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">USD</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Monthly Limit Maximum Count:</label>
                <div className="mt-2 flex items-center">
                  <input type="number" value={monthlyLimitCount ?? ''} onChange={(e) => setMonthlyLimitCount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="ml-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">Times</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="button" onClick={addFieldOption} className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Add Field Option</button>
            </div>

            <div className="space-y-4">
              {fieldOptions.map((opt) => (
                <div key={opt.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                  <input value={opt.name} onChange={(e) => updateFieldOption(opt.id, { name: e.target.value })} placeholder="Field Name" className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
                  <select value={opt.type} onChange={(e) => updateFieldOption(opt.id, { type: e.target.value })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                    <option value="text">Input Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="file">File upload</option>
                  </select>
                  <select value={opt.validation} onChange={(e) => updateFieldOption(opt.id, { validation: e.target.value })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                    <option value="required">Required</option>
                    <option value="nullable">Optional</option>
                  </select>
                  <button type="button" onClick={() => removeFieldOption(opt.id)} className="rounded-full bg-pink-500 p-2 text-white hover:bg-pink-600">×</button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Instruction to transfer:</label>
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={6} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
            </div>

            <div>
              <button type="submit" className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WireTransferSettings;
