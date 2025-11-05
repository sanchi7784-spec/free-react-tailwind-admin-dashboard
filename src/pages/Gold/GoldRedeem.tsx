import { useState } from "react";

interface GoldRedeemTransaction {
  id: string;
  user: string;
  username: string;
  date: string;
  time: string;
  relativeTime: string;
  trxId: string;
  category: string;
  karat: string;
  quantity: number;
  amount: number;
  charges: number;
  status: "Processing" | "Shipped" | "Completed" | "Cancelled";
}

const goldRedeemData: GoldRedeemTransaction[] = [
  {
    id: "1",
    user: "Sade Hewitt",
    username: "@kobaz12",
    date: "2025-11-01",
    time: "11:51 PM",
    relativeTime: "3 days ago",
    trxId: "6RNX4XNR3DXY",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 10.0,
    amount: 1182.01,
    charges: 24.64,
    status: "Processing",
  },
  {
    id: "2",
    user: "test user 2",
    username: "@test564",
    date: "2025-10-09",
    time: "01:55 PM",
    relativeTime: "3 weeks ago",
    trxId: "RTT8VWERMODZ",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 10.0,
    amount: 1138.96,
    charges: 23.78,
    status: "Processing",
  },
  {
    id: "3",
    user: "test user2",
    username: "@test564",
    date: "2025-10-08",
    time: "07:36 PM",
    relativeTime: "3 weeks ago",
    trxId: "O5MGCHXFI1TA",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 10.0,
    amount: 1138.96,
    charges: 23.78,
    status: "Processing",
  },
  {
    id: "4",
    user: "User Name",
    username: "@username",
    date: "2025-08-13",
    time: "11:25 AM",
    relativeTime: "2 months ago",
    trxId: "287TAZSVFNFY",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 10.0,
    amount: 990.33,
    charges: 20.81,
    status: "Processing",
  },
  {
    id: "5",
    user: "User Name",
    username: "@username",
    date: "2025-07-12",
    time: "12:22 PM",
    relativeTime: "3 months ago",
    trxId: "UL1EP7DNP54J",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 12.0,
    amount: 1185.22,
    charges: 24.7,
    status: "Processing",
  },
  {
    id: "6",
    user: "User Name",
    username: "@username",
    date: "2025-07-01",
    time: "09:05 AM",
    relativeTime: "4 months ago",
    trxId: "GA2XCRURILRF",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 2.0,
    amount: 196.8,
    charges: 4.94,
    status: "Processing",
  },
  {
    id: "7",
    user: "User Name",
    username: "@username",
    date: "2025-06-24",
    time: "02:14 PM",
    relativeTime: "4 months ago",
    trxId: "GBEBPM5XTQS8",
    category: "18 Karat Gold",
    karat: "18 Karat",
    quantity: 2.0,
    amount: 163.48,
    charges: 4.27,
    status: "Processing",
  },
];

const GoldRedeem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<GoldRedeemTransaction | null>(null);

  const filteredData = goldRedeemData.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.trxId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openModal = (transaction: GoldRedeemTransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Redeem History
          </h1>
        </div>

        {/* Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Username/Category Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username/Category
            </label>
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="All">All</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range with Filter Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Start Date - End Date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="w-[12%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    User
                  </th>
                  <th className="w-[14%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="w-[12%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Trx
                  </th>
                  <th className="w-[10%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="w-[10%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="w-[12%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Amount & Charge
                  </th>
                  <th className="w-[10%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[20%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    } hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                  >
                    <td className="px-6 py-8">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                          {transaction.user}
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          {transaction.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-gray-900 dark:text-white leading-relaxed">
                          {transaction.date}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.time}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.relativeTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {transaction.trxId}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.karat}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {transaction.quantity.toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          gram
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${transaction.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-900 dark:text-white">
                          USD
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ${transaction.charges.toFixed(2)} USD
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "Processing"
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            : transaction.status === "Shipped"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : transaction.status === "Completed"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => openModal(transaction)}
                          className="w-full px-3 py-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-2"
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Details
                        </button>
                        <button className="w-full px-3 py-2.5 text-xs font-medium text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2">
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
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                          Ship
                        </button>
                        <button className="w-full px-3 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {filteredData.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b border-gray-200 dark:border-slate-600 p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
              >
                {/* User Info */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {transaction.user}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {transaction.username}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      transaction.status === "Processing"
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                        : transaction.status === "Shipped"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : transaction.status === "Completed"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Date & Time
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {transaction.date}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {transaction.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Transaction ID
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {transaction.trxId}
                    </p>
                  </div>
                </div>

                {/* Category and Quantity */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.category}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {transaction.karat}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Quantity
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.quantity.toFixed(4)} gram
                    </p>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Amount
                    </p>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Charge
                    </p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ${transaction.charges.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => openModal(transaction)}
                    className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center gap-1"
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Details
                  </button>
                  <button className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-1">
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
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    Ship
                  </button>
                  <button className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1">
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No transactions found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Redeem Details
                </h2>
                <button
                  onClick={closeModal}
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

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Details Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Order Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Gold bar - {selectedTransaction.quantity.toFixed(2)} gram ({Math.floor(selectedTransaction.quantity / 10)} pieces)
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-slate-700"></div>

                {/* Delivery Details Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Delivery - <span className="text-gray-600 dark:text-gray-400 font-normal">Home Delivery</span>
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span> {selectedTransaction.username}, City: Metropolitan, State: Active, Zip Code: {selectedTransaction.trxId.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoldRedeem;
