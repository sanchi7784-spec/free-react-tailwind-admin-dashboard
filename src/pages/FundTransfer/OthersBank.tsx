import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { PlusIcon, PencilIcon, TrashBinIcon } from '../../icons';

const sampleBanks = [
  { id: 1, logo: '/images/product/product-01.jpg', name: 'Capital One', code: 'capital', processingTime: '5 hours', status: 'Active' },
  { id: 2, logo: '/images/product/product-02.jpg', name: 'Citibank', code: 'citi', processingTime: '2 hours', status: 'Active' },
];

const OthersBank: React.FC = () => {
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState('15');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fieldOptions, setFieldOptions] = useState<{ id: number; label: string; type: string }[]>([]);
  const initialForm = {
    name: '',
    code: '',
    processing_time: '',
    processing_type: 'hours',
    charge: '',
    charge_type: 'percentage',
    minimum_transfer: '',
    maximum_transfer: '',
    daily_limit_maximum_amount: '',
    daily_limit_maximum_count: '',
    monthly_limit_maximum_amount: '',
    monthly_limit_maximum_count: '',
    details: '',
    status: '1',
    logoPreview: '',
    logoFile: null,
  } as any;

  const [form, setForm] = useState<any>(initialForm);

  const addFieldOption = () => {
    setFieldOptions((prev) => [...prev, { id: Date.now(), label: '', type: 'text' }]);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev: any) => ({ ...prev, logoFile: file, logoPreview: url }));
  };

  const handleEdit = (b: any) => {
    // populate form with bank data (mock)
    setEditingId(b.id);
    const processingNumber = b.processingTime?.split(' ')[0] || '';
    setForm({
      name: b.name || '',
      code: b.code || '',
      processing_time: processingNumber,
      processing_type: 'hours',
      charge: '1',
      charge_type: 'percentage',
      minimum_transfer: '10.00',
      maximum_transfer: '10000.00',
      daily_limit_maximum_amount: '100000.00',
      daily_limit_maximum_count: '10',
      monthly_limit_maximum_amount: '1000000.00',
      monthly_limit_maximum_count: '100',
      details:
        'Capital One Financial Corporation is an American bank holding company specializing in credit cards, auto loans, banking, and savings accounts, headquartered in McLean, Virginia with operations primarily in the United States.',
      status: '1',
      logoPreview: b.logo || '',
    });

    // prefill field options as in provided HTML
    setFieldOptions([
      { id: 1, label: 'Account Number', type: 'text' },
      { id: 2, label: 'Account Holder Name', type: 'text' },
      { id: 3, label: 'Branch Name', type: 'text' },
    ]);

    setShowAddForm(true);
  };

  const removeFieldOption = (id: number) => {
    setFieldOptions((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFieldOption = (id: number, key: string, value: string) => {
    setFieldOptions((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, fieldOptions };
    console.log('Saving Others Bank', payload);
    // TODO: call API
    alert('Saved (mock). Check console for payload.');
    setShowAddForm(false);
  };

  return (
    <>
      <PageMeta title="Others Bank | Admin Dashboard" description="Manage other banks" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Others Bank</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setForm(initialForm);
                setFieldOptions([]);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
              </svg>
              <span>ADD NEW</span>
            </button>
          </div>
        </div>

        {!showAddForm ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b p-4 dark:border-gray-700">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200" />
                  <button type="submit" className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700">SEARCH</button>
                </div>

                <div className="flex items-center gap-3">
                  <select value={perPage} onChange={(e) => setPerPage(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">LOGO</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">NAME</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">CODE</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">PROCESSING TIME</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">STATUS</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleBanks.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-6">{b.logo ? <img src={b.logo} alt={b.name} className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800" />}</td>
                      <td className="px-6 py-6 text-gray-900 dark:text-gray-100">{b.name}</td>
                      <td className="px-6 py-6 text-gray-900 dark:text-gray-100">{b.code}</td>
                      <td className="px-6 py-6 text-gray-900 dark:text-gray-100">{b.processingTime}</td>
                      <td className="px-6 py-6"><span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">{b.status}</span></td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEdit(b)} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700" aria-label="Edit">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600" aria-label="Delete">
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {sampleBanks.map((b) => (
                <div key={b.id} className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{b.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{b.code}</div>
                    </div>
                    <div><span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">{b.status}</span></div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Processing: {b.processingTime}</div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 dark:border-gray-700">
              <nav className="flex items-center gap-2">
                <button disabled className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 dark:bg-gray-800 dark:border-gray-700">Prev</button>
                <button className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white">1</button>
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">Next</button>
              </nav>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{editingId ? 'Edit Others Bank' : 'Add Others Bank'}</h2>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                Back
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Logo:</label>
                <div className="mt-2">
                  {editingId === null ? (
                    /* Add mode: dashed uploader until file selected, then show preview with change option */
                    !form.logoPreview ? (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                        <div className="text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Click to upload or drag and drop</div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">
                          <input type="file" accept=".gif,.jpg,.jpeg,.png" onChange={handleLogoChange} className="hidden" />
                          Upload Logo
                        </label>
                        <div className="text-sm text-gray-500">Supported: .gif, .jpg, .png</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block w-48 h-28 rounded border-2 border-dashed border-gray-300 bg-cover bg-center cursor-pointer hover:border-purple-500 dark:border-gray-600" style={{ backgroundImage: `url(${form.logoPreview})` }}>
                          <input type="file" accept=".gif,.jpg,.jpeg,.png" onChange={handleLogoChange} className="hidden" />
                          <div className="w-full h-full flex items-end">
                            <span className="w-full text-center bg-purple-600 text-white py-1 rounded-b text-sm">Change Logo</span>
                          </div>
                        </label>
                      </div>
                    )
                  ) : (
                    /* Edit mode: show existing logo preview with update controls */
                    <div className="space-y-3">
                      {form.logoPreview && (
                        <div className="w-48 h-28 rounded border-2 border-gray-300 bg-cover bg-center dark:border-gray-600" style={{ backgroundImage: `url(${form.logoPreview})` }} />
                      )}
                      <div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                          <input type="file" accept=".gif,.jpg,.jpeg,.png" onChange={handleLogoChange} className="hidden" />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Update Logo
                        </label>
                        <div className="mt-1 text-sm text-gray-500">Supported: .gif, .jpg, .png</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name:</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Code Name:</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Processing Time:</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input value={form.processing_time} onChange={(e) => setForm({ ...form, processing_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <select value={form.processing_type} onChange={(e) => setForm({ ...form, processing_type: e.target.value })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Charges:</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" step="0.01" value={form.charge} onChange={(e) => setForm({ ...form, charge: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <select value={form.charge_type} onChange={(e) => setForm({ ...form, charge_type: e.target.value })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Minimum Transfer Amount:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.minimum_transfer} onChange={(e) => setForm({ ...form, minimum_transfer: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Maximum Transfer Amount:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.maximum_transfer} onChange={(e) => setForm({ ...form, maximum_transfer: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Daily Limit Maximum Amount:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.daily_limit_maximum_amount} onChange={(e) => setForm({ ...form, daily_limit_maximum_amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Daily Limit Maximum Count:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.daily_limit_maximum_count} onChange={(e) => setForm({ ...form, daily_limit_maximum_count: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">Times</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Monthly Limit Maximum Amount:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.monthly_limit_maximum_amount} onChange={(e) => setForm({ ...form, monthly_limit_maximum_amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Monthly Limit Maximum Count:</label>
                  <div className="mt-2 flex">
                    <input type="number" value={form.monthly_limit_maximum_count} onChange={(e) => setForm({ ...form, monthly_limit_maximum_count: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                    <span className="ml-2 inline-flex items-center rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">Times</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={addFieldOption} className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Add Field Option</button>
                </div>

                <div className="mt-4 space-y-3">
                  {fieldOptions.map((f) => (
                    <div key={f.id} className="flex gap-2">
                      <input value={f.label} onChange={(e) => updateFieldOption(f.id, 'label', e.target.value)} placeholder="Label" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
                      <select value={f.type} onChange={(e) => updateFieldOption(f.id, 'type', e.target.value)} className="w-1/4 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="textarea">Textarea</option>
                      </select>
                      <button type="button" onClick={() => removeFieldOption(f.id)} className="rounded-md bg-red-500 px-3 py-2 text-white">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Instruction to transfer:</label>
                <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={6} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
              </div>

              <div className="flex gap-4 items-center">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Status:</div>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" checked={form.status === '1'} onChange={() => setForm({ ...form, status: '1' })} />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" checked={form.status === '0'} onChange={() => setForm({ ...form, status: '0' })} />
                      <span className="text-sm">Deactivate</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1" />

                <div className="w-full md:w-1/3">
                  <button type="submit" className="w-full rounded-md bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-700">{editingId ? 'Save Changes' : 'Create Bank'}</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default OthersBank;
