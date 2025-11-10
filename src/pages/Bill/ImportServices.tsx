import React, { useMemo, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { Link } from 'react-router';

// Mock hierarchical data: categories -> operators -> plans
type Plan = { id: string; name: string; price: number };
type OperatorMap = Record<string, Plan[]>;
type CategoryMap = Record<string, { operators: OperatorMap }>;

const DATA: CategoryMap = {
  'Mobile Recharge': {
    operators: {
      'AT&T': [
        { id: 'at-1', name: 'Rs 99 Plan', price: 99 },
        { id: 'at-2', name: 'Rs 199 Plan', price: 199 },
      ],
      'Verizon': [
        { id: 'vz-1', name: 'Rs 49 Plan', price: 49 },
        { id: 'vz-2', name: 'Rs 149 Plan', price: 149 },
      ],
      'T-Mobile': [
        { id: 'tm-1', name: 'Rs 79 Plan', price: 79 },
      ],
    },
  },
  'DTH Recharge': {
    operators: {
      'Dish TV': [
        { id: 'dt-1', name: 'Rs 199 Basic', price: 199 },
        { id: 'dt-2', name: 'Rs 499 Silver', price: 499 },
      ],
      'Sky': [
        { id: 'sky-1', name: 'Rs 299 Plan', price: 299 },
      ],
    },
  },
  'Electricity Bill Payment': {
    operators: {
      'City Power': [
        { id: 'cp-1', name: 'Pay Rs 100', price: 100 },
      ],
      'State Grid': [
        { id: 'sg-1', name: 'Pay Rs 250', price: 250 },
      ],
    },
  },
  'Water Bill Payment': {
    operators: {
      'WaterWorks': [
        { id: 'ww-1', name: 'Pay Rs 50', price: 50 },
      ],
    },
  },
  'Other Services': {
    operators: {
      'Parking': [{ id: 'pk-1', name: 'Hourly Rs 20', price: 20 }],
    },
  },
};

const categories = Object.keys(DATA);

const ImportServices: React.FC = () => {
  const [category, setCategory] = useState<string>('');
  const [operator, setOperator] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [previewList, setPreviewList] = useState<any[]>([]);
  // UI state


  const operators = useMemo(() => {
    if (!category) return [];
    const cat = DATA[category as keyof CategoryMap];
    if (!cat) return [];
    return Object.keys(cat.operators);
  }, [category]);

  const plans = useMemo(() => {
    if (!category || !operator) return [];
    const cat = DATA[category as keyof CategoryMap];
    if (!cat) return [];
    return cat.operators[operator] || [];
  }, [category, operator]);

  const selectedPlan = useMemo(() => plans.find((p: any) => p.id === planId), [plans, planId]);

  function handleAddToPreview() {
    if (!category || !operator || !planId) return alert('Please choose category, operator and plan');
    if (!phoneNumber) return alert('Please enter a phone number');
    setPreviewList((p) => [
      ...p,
      {
        id: Date.now(),
        category,
        operator,
        plan: selectedPlan?.name || '',
        price: selectedPlan?.price || 0,
        phoneNumber,
      },
    ]);
    // reset selections if desired
    setCategory('');
    setOperator('');
    setPlanId('');
    setPhoneNumber('');
  }

  function handleRemovePreview(id: number) {
    setPreviewList((p) => p.filter((x) => x.id !== id));
  }

  function handleImport() {
    if (!previewList.length) return alert('Nothing to import');
    console.log('Importing services', previewList);
    alert('Imported ' + previewList.length + ' service(s) (mock)');
    setPreviewList([]);
  }

  return (
    <div className="p-6">
      <PageMeta title="Import Services | Admin Dashboard" description="Import bill payment services" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Services</h1>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                    <select value={category} onChange={(e) => { setCategory(e.target.value); setOperator(''); setPlanId(''); }} className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Operator</label>
                    <select value={operator} onChange={(e) => { setOperator(e.target.value); setPlanId(''); }} disabled={!category} className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <option value="">Select operator</option>
                      {operators.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Plan (Rs)</label>
                    <select value={planId} onChange={(e) => setPlanId(e.target.value)} disabled={!operator} className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <option value="">Select plan</option>
                      {plans.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} — Rs {p.price}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone number input — enabled only after category/operator/plan are selected */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    disabled={!(category && operator && planId)}
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This will be associated with the imported plan.</p>
                </div>

                <div className="pt-4">
                  <button type="button" onClick={handleAddToPreview} className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Add to preview</button>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Preview</h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Category</th>
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Operator</th>
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Plan</th>
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Phone</th>
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Price (Rs)</th>
                          <th className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No services added for import</td>
                          </tr>
                        ) : (
                          previewList.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50">
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.category}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.operator}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.plan}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.phoneNumber || '-'}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Rs {item.price}</td>
                                <td className="px-4 py-3">
                                  <button onClick={() => handleRemovePreview(item.id)} className="rounded-md bg-red-500 px-3 py-1 text-sm text-white">Remove</button>
                                </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Quick Actions</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <button onClick={handleImport} className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">Import Selected</button>
                  </div>
                  <div>
                    <Link to="/bill/billservices-list" className="w-full inline-block text-center rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700">Go to Services List</Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Help</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select a category first, then choose the relevant operator. Plans will appear once an operator is selected.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small responsive cards for mobile preview (if you want) */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {previewList.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No services added for import</div>
            ) : (
              previewList.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.plan}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.operator} • {item.category}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Phone: {item.phoneNumber || '-'}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Rs {item.price}</div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportServices;
