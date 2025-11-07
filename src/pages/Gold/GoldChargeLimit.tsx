import { useState } from "react";

interface ChargeLimit {
  id: string;
  slug: string;
  minAmount: number;
  maxAmount: number;
  fixedCharge: number;
  percentCharge: number;
  vat: number;
}

const chargeLimitData: ChargeLimit[] = [
  {
    id: "1",
    slug: "Buy",
    minAmount: 10.0,
    maxAmount: 10000.0,
    fixedCharge: 1.0,
    percentCharge: 1.0,
    vat: 2.5,
  },
  {
    id: "2",
    slug: "Sell",
    minAmount: 10.0,
    maxAmount: 10000.0,
    fixedCharge: 2.0,
    percentCharge: 3.0,
    vat: 0,
  },
  {
    id: "3",
    slug: "Gift",
    minAmount: 10.0,
    maxAmount: 10000.0,
    fixedCharge: 1.0,
    percentCharge: 2.0,
    vat: 0,
  },
  {
    id: "4",
    slug: "Redeem",
    minAmount: 10.0,
    maxAmount: 10000.0,
    fixedCharge: 1.0,
    percentCharge: 2.0,
    vat: 0,
  },
];

const GoldChargeLimit = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<ChargeLimit | null>(null);
  const [limits, setLimits] = useState<ChargeLimit[]>(chargeLimitData);

  // Form states
  const [formMinAmount, setFormMinAmount] = useState("");
  const [formMaxAmount, setFormMaxAmount] = useState("");
  const [formFixedCharge, setFormFixedCharge] = useState("");
  const [formPercentCharge, setFormPercentCharge] = useState("");
  const [formVat, setFormVat] = useState("");

  const openEditModal = (limit: ChargeLimit) => {
    setSelectedLimit(limit);
    setFormMinAmount(limit.minAmount.toString());
    setFormMaxAmount(limit.maxAmount.toString());
    setFormFixedCharge(limit.fixedCharge.toString());
    setFormPercentCharge(limit.percentCharge.toString());
    setFormVat(limit.vat.toString());
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLimit(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLimit) {
      setLimits(
        limits.map((limit) =>
          limit.id === selectedLimit.id
            ? {
                ...limit,
                minAmount: parseFloat(formMinAmount),
                maxAmount: parseFloat(formMaxAmount),
                fixedCharge: parseFloat(formFixedCharge),
                percentCharge: parseFloat(formPercentCharge),
                vat: parseFloat(formVat),
              }
            : limit
        )
      );
    }
    closeEditModal();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manage Charge Limit
          </h1>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Min Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Max Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Fixed Charge
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Percent Charge
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Vat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {limits.map((limit, index) => (
                  <tr
                    key={limit.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    } hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {limit.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        ${limit.minAmount.toFixed(2)} USD
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        ${limit.maxAmount.toFixed(2)} USD
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        ${limit.fixedCharge.toFixed(2)} USD
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {limit.percentCharge.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {limit.vat > 0 ? `${limit.vat.toFixed(2)}%` : "--"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(limit)}
                        className="px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-1.5"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {limits.map((limit) => (
              <div
                key={limit.id}
                className="border-b border-gray-200 dark:border-slate-600 p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {limit.slug}
                  </h3>
                  <button
                    onClick={() => openEditModal(limit)}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Min Amount
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${limit.minAmount.toFixed(2)} USD
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Max Amount
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${limit.maxAmount.toFixed(2)} USD
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Fixed Charge
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${limit.fixedCharge.toFixed(2)} USD
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Percent Charge
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {limit.percentCharge.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      VAT
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {limit.vat > 0 ? `${limit.vat.toFixed(2)}%` : "--"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedLimit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Update {selectedLimit.slug} charge limit
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                {/* Min Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formMinAmount}
                      onChange={(e) => setFormMinAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-16"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      USD
                    </span>
                  </div>
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formMaxAmount}
                      onChange={(e) => setFormMaxAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-16"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      USD
                    </span>
                  </div>
                </div>

                {/* Fixed Charge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fixed Charge <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formFixedCharge}
                      onChange={(e) => setFormFixedCharge(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-16"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      USD
                    </span>
                  </div>
                </div>

                {/* Percent Charge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Percent Charge <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formPercentCharge}
                      onChange={(e) => setFormPercentCharge(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      %
                    </span>
                  </div>
                </div>

                {/* VAT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vat <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formVat}
                      onChange={(e) => setFormVat(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      %
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoldChargeLimit;
