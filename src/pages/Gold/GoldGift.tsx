import { useState } from "react";

interface GoldGiftTransaction {
  id: string;
  user: string;
  username: string;
  recipient: string;
  recipientUsername: string;
  date: string;
  time: string;
  relativeTime: string;
  trxId: string;
  category: string;
  karat: string;
  quantity: number;
  amount: number;
  charges: number;
}

const goldGiftData: GoldGiftTransaction[] = [
  {
    id: "1",
    user: "test user2",
    username: "@test564",
    recipient: "Be Somebody",
    recipientUsername: "@obsmary",
    date: "2025-10-08",
    time: "08:32 PM",
    relativeTime: "3 weeks ago",
    trxId: "9TMIZFGOGHML",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 4.39,
    amount: 500.0,
    charges: 11.0,
  },
  {
    id: "2",
    user: "Katushabe Gedion",
    username: "@katushabe",
    recipient: "waliberg austin",
    recipientUsername: "@tdfghg43",
    date: "2025-09-03",
    time: "09:47 PM",
    relativeTime: "2 months ago",
    trxId: "8ICD2J3OKGME",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.0962,
    amount: 10.0,
    charges: 1.2,
  },
  {
    id: "3",
    user: "User Name",
    username: "@username",
    recipient: "JBR Kalyan",
    recipientUsername: "@siddigui",
    date: "2025-08-20",
    time: "12:40 PM",
    relativeTime: "2 months ago",
    trxId: "RCK1IX6IHWPW",
    category: "Traditional Gold",
    karat: "15 Karat",
    quantity: 0.1481,
    amount: 10.0,
    charges: 1.2,
  },
  {
    id: "4",
    user: "User Name",
    username: "@username",
    recipient: "Mammun Khan",
    recipientUsername: "@demouser2",
    date: "2025-07-08",
    time: "02:37 PM",
    relativeTime: "3 months ago",
    trxId: "VQX6JSCUD8TJ",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.3037,
    amount: 30.0,
    charges: 1.6,
  },
  {
    id: "5",
    user: "User Name",
    username: "@username",
    recipient: "Mammun Khan",
    recipientUsername: "@demouser2",
    date: "2025-07-08",
    time: "02:36 PM",
    relativeTime: "3 months ago",
    trxId: "7C9YAOWY9TYN",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.3037,
    amount: 30.0,
    charges: 1.6,
  },
  {
    id: "6",
    user: "User Name",
    username: "@username",
    recipient: "Mammun Khan",
    recipientUsername: "@demouser2",
    date: "2025-07-08",
    time: "02:36 PM",
    relativeTime: "3 months ago",
    trxId: "E9QLK93ACS35",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.324,
    amount: 32.0,
    charges: 1.64,
  },
  {
    id: "7",
    user: "Tanisha Bray",
    username: "@neceps",
    recipient: "User Name",
    recipientUsername: "@username",
    date: "2025-06-28",
    time: "07:08 AM",
    relativeTime: "4 months ago",
    trxId: "XKE9DK31AZEN",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.1001,
    amount: 10.0,
    charges: 1.2,
  },
  {
    id: "8",
    user: "Mohd Yoonus",
    username: "@myoonusm",
    recipient: "Bro Man",
    recipientUsername: "@ludachuks",
    date: "2025-06-10",
    time: "09:56 PM",
    relativeTime: "4 months ago",
    trxId: "O4SHID3337YW",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 1.001,
    amount: 100.0,
    charges: 3.0,
  },
  {
    id: "9",
    user: "Mohd Yoonus",
    username: "@myoonusm",
    recipient: "Bro Man",
    recipientUsername: "@ludachuks",
    date: "2025-06-10",
    time: "09:56 PM",
    relativeTime: "4 months ago",
    trxId: "IYL2FOM627XO",
    category: "22 Karat Gold",
    karat: "22 Karat",
    quantity: 0.2002,
    amount: 20.0,
    charges: 1.4,
  },
];

const GoldGift = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");

  const filteredData = goldGiftData.filter((transaction) => {
    const matchesSearch =
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipientUsername
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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
            Gift History
          </h1>
        </div>

        {/* Filter Section */}
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
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="w-[13%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    User
                  </th>
                  <th className="w-[13%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="w-[14%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="w-[12%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Trx
                  </th>
                  <th className="w-[13%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="w-[11%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="w-[14%] px-6 py-6 text-left text-sm font-bold uppercase tracking-wider">
                    Amount & Charge
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                          {transaction.recipient}
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          {transaction.recipientUsername}
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
                {/* User & Recipient Info */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      User
                    </p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {transaction.user}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {transaction.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Recipient
                    </p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {transaction.recipient}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {transaction.recipientUsername}
                    </p>
                  </div>
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
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-600 px-2 py-1 rounded inline-block mt-1">
                      {transaction.relativeTime}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Transaction ID
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 grid grid-cols-2 gap-2">
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
              <p className="text-sm opacity-90">Total Gifts</p>
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
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg p-4 text-white shadow-lg">
              <p className="text-sm opacity-90">Total Charges</p>
              <p className="text-2xl font-bold mt-1">
                $
                {filteredData
                  .reduce((sum, t) => sum + t.charges, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoldGift;
