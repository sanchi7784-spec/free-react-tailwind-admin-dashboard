import { useState } from "react";

interface GoldTransaction {
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
  vat: number;
}

const goldBuyData: GoldTransaction[] = [
  {
    id: "1",
    user: "Realm Innovators",
    username: "@srinisanth",
    date: "2025-10-27",
    time: "09:14 AM",
    relativeTime: "1 week ago",
    trxId: "MF1HECFJ4QWW",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.1756,
    amount: 20.0,
    charges: 1.2,
    vat: 0.5,
  },
  {
    id: "2",
    user: "My Name",
    username: "@drtyul",
    date: "2025-10-21",
    time: "11:34 PM",
    relativeTime: "2 weeks ago",
    trxId: "8TERV831OB4V",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.878,
    amount: 100.0,
    charges: 2.0,
    vat: 2.5,
  },
  {
    id: "3",
    user: "Do Ngoc Khai",
    username: "@fffffffffffffffffff",
    date: "2025-10-21",
    time: "01:09 AM",
    relativeTime: "2 weeks ago",
    trxId: "65KU72PCKWPQ",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 8.7799,
    amount: 1000.0,
    charges: 11.0,
    vat: 25.0,
  },
  {
    id: "4",
    user: "Nabil Mamou",
    username: "@nabil09",
    date: "2025-10-18",
    time: "06:00 PM",
    relativeTime: "2 weeks ago",
    trxId: "OBITWVH3N3VU",
    category: "Traditional Gold",
    karat: "15 Karat",
    quantity: 83.6763,
    amount: 6498.0,
    charges: 65.98,
    vat: 162.45,
  },
  {
    id: "5",
    user: "Nabil Mamou",
    username: "@nabil09",
    date: "2025-10-18",
    time: "05:59 PM",
    relativeTime: "2 weeks ago",
    trxId: "4R3WQ9O4BRRB",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 17.0331,
    amount: 1940.0,
    charges: 20.4,
    vat: 48.5,
  },
  {
    id: "6",
    user: "Abc Gold",
    username: "@abcgold",
    date: "2025-10-13",
    time: "10:03 AM",
    relativeTime: "3 weeks ago",
    trxId: "HQOP9E1YS7DB",
    category: "21 Karat Gold",
    karat: "21 Karat",
    quantity: 0.9198,
    amount: 100.0,
    charges: 2.0,
    vat: 2.5,
  },
  {
    id: "7",
    user: "Abc Gold",
    username: "@abcgold",
    date: "2025-10-13",
    time: "10:02 AM",
    relativeTime: "3 weeks ago",
    trxId: "IRGP18W7L1Q7",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.878,
    amount: 100.0,
    charges: 2.0,
    vat: 2.5,
  },
  {
    id: "8",
    user: "test user2",
    username: "@test564",
    date: "2025-10-11",
    time: "03:40 PM",
    relativeTime: "3 weeks ago",
    trxId: "2ASU6IPNZ4R7",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 6.5323,
    amount: 744.0,
    charges: 8.44,
    vat: 18.6,
  },
  {
    id: "9",
    user: "Deepak pareek",
    username: "@deepakpareek",
    date: "2025-10-11",
    time: "03:38 PM",
    relativeTime: "3 weeks ago",
    trxId: "G2XX4G26FZ9F",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.7142,
    amount: 81.35,
    charges: 1.81,
    vat: 2.03,
  },
];

const GoldBuy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");

  const filteredData = goldBuyData.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.trxId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Buy History
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Username/Category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Date Range Input */}
          <div className="relative sm:w-80">
            <input
              type="text"
              placeholder="Start Date - End Date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Trx
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Amount & Charge
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Vat
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
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.user}
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          {transaction.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.date} {transaction.time}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.relativeTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {transaction.trxId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.karat}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {transaction.quantity.toFixed(4)} gram
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${transaction.amount.toFixed(2)} USD
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ${transaction.charges.toFixed(2)} USD
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${transaction.vat.toFixed(2)} USD
                      </span>
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
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-600 px-2 py-1 rounded">
                    {transaction.relativeTime}
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 grid grid-cols-3 gap-2">
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
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      VAT
                    </p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      ${transaction.vat.toFixed(2)}
                    </p>
                  </div>
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

        {/* Summary Stats */}
        {filteredData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{filteredData.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Quantity</p>
              <p className="text-2xl font-bold mt-1">
                {filteredData
                  .reduce((sum, t) => sum + t.quantity, 0)
                  .toFixed(2)}{" "}
                g
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-2xl font-bold mt-1">
                $
                {filteredData
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-sm opacity-90">Total VAT</p>
              <p className="text-2xl font-bold mt-1">
                $
                {filteredData.reduce((sum, t) => sum + t.vat, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoldBuy;
