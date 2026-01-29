import { useEffect, useState } from "react";

interface Transaction {
  transaction_id: number;
  user_id: number;
  name: string;
  transaction_type: string;
  value_type: string;
  purchase_mode: string;
  currency: string;
  amount: number;
  quantity_grams: number;
  price_per_gram: number;
  payment_mode: string;
  payment_status: string;
}

interface ApiResponse {
  detail: string;
  total_transactions: number;
  transactions: Transaction[];
}

const GoldRedeem = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [appliedStart, setAppliedStart] = useState<number | null>(null);
  const [appliedEnd, setAppliedEnd] = useState<number | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const base = (import.meta as any).env?.VITE_API_BASE ?? "https://api.mastropaytech.com";
        const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
        const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
        const url = userId
          ? `${base.replace(/\/$/, "")}/dashboard/gold-transactions/${userId}`
          : `${base.replace(/\/$/, "")}/dashboard/gold-transactions`;

        const headers: Record<string,string> = { "Content-Type": "application/json" };
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

        const res = await fetch(url, { signal: ac.signal, headers });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let errorData: any = null;
          try {
            errorData = text ? JSON.parse(text) : null;
          } catch {
            // Not JSON
          }
          const message = errorData?.detail || text || `${res.status} ${res.statusText}`;
          const err = new Error(message);
          (err as any).detail = errorData?.detail || text;
          throw err;
        }
        const data: ApiResponse = await res.json();
        setTransactions(data.transactions || []);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err?.detail || err?.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => ac.abort();
  }, []);

  const filteredData = transactions.filter((t) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.transaction_id.toString().includes(q) ||
      t.payment_mode.toLowerCase().includes(q) ||
      t.payment_status.toLowerCase().includes(q) ||
      t.transaction_type.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "All" || t.payment_status === statusFilter;
    let matchesDate = true;
    if (appliedStart !== null && appliedEnd !== null) {
      const dateStr = (t as any).date || (t as any).created_at || (t as any).createdAt || (t as any).timestamp || null;
      if (!dateStr) {
        matchesDate = false;
      } else {
        const parsed = Date.parse(dateStr);
        if (isNaN(parsed)) {
          const parsed2 = Date.parse(dateStr.replace(/\s+/g, ' '));
          if (isNaN(parsed2)) matchesDate = false;
          else matchesDate = parsed2 >= appliedStart && parsed2 <= appliedEnd;
        } else {
          matchesDate = parsed >= appliedStart && parsed <= appliedEnd;
        }
      }
    }
    return matchesSearch && matchesStatus && matchesDate;
  });
  function applyDateFilter() {
    const raw = dateRange.trim();
    if (!raw) {
      setAppliedStart(null);
      setAppliedEnd(null);
      setDateError(null);
      return;
    }
    const parts = raw.split(/\s*-\s*|\s+to\s+|\u2013|\u2014/).map((s) => s.trim()).filter(Boolean);
    try {
      if (parts.length === 1) {
        const d = new Date(parts[0]);
        if (isNaN(d.getTime())) throw new Error("Invalid date");
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
        setAppliedStart(start);
        setAppliedEnd(end);
        setDateError(null);
        return;
      }
      if (parts.length >= 2) {
        const s = new Date(parts[0]);
        const e = new Date(parts[1]);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) throw new Error("Invalid date range");
        const start = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0).getTime();
        const end = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999).getTime();
        if (start > end) throw new Error("Start date is after end date");
        setAppliedStart(start);
        setAppliedEnd(end);
        setDateError(null);
        return;
      }
      throw new Error("Invalid date input");
    } catch (err: any) {
      setDateError(err?.detail || err?.message || "Invalid date range");
      setAppliedStart(null);
      setAppliedEnd(null);
    }
  }
  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Gold Transaction History
          </h1>
        </div>
        {/* Filter Section */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Date Range with Filter Button */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
              Date Range
            </label>
            <div className="flex flex-col xs:flex-row gap-2">
              <input
                type="text"
                placeholder="YYYY-MM-DD - YYYY-MM-DD"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button type="button" onClick={applyDateFilter} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-stone-900 hover:bg-indigo-700 text-white rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 whitespace-nowrap">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="hidden xs:inline">Filter</span>
                <span className="xs:hidden">Apply</span>
              </button>
            </div>
            {dateError && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{dateError}</p>}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Loading / Error */}
          {(loading || error) && (
            <div className="p-3 sm:p-4">
              {loading && (
                <div className="text-center py-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300">Loading transactions...</div>
              )}
              {error && (
                <div className="text-center py-6 text-xs sm:text-sm text-red-600">Error: {error}</div>
              )}
            </div>
          )}

          {(!loading && !error) && (
            <div className="max-h-[60vh] overflow-auto relative">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-stone-900 text-white sticky top-0 z-10">
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">User</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Trx ID</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Type</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Value Type</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Purchase Mode</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Amount</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Quantity (g)</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Price/g</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Payment Mode</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Status</th>
                      <th className="px-3 xl:px-4 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((transaction, index) => (
                    <tr
                      key={transaction.transaction_id}
                      className={`${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"} hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                    >
                      <td className="px-3 xl:px-4 py-3 xl:py-4 break-words whitespace-normal">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs xl:text-sm font-medium text-gray-900 dark:text-white truncate">{transaction.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">ID: {transaction.user_id}</span>
                        </div>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 break-words whitespace-normal">
                        <span className="text-xs xl:text-sm font-mono text-gray-700 dark:text-gray-300 break-words">{transaction.transaction_id}</span>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.transaction_type}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.value_type}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.purchase_mode}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 break-words whitespace-normal">
                        <div className="text-xs xl:text-sm font-semibold text-gray-900 dark:text-white">{transaction.currency} {transaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.quantity_grams.toFixed(4)}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.price_per_gram.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 text-xs xl:text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.payment_mode}</td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${transaction.payment_status === "Pending" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : transaction.payment_status === "Successful" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : transaction.payment_status === "Failed" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"}`}>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="px-3 xl:px-4 py-3 xl:py-4 min-w-0">
                        <div className="flex gap-1.5 xl:gap-2">
                          <button onClick={() => openModal(transaction)} className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors whitespace-nowrap">Details</button>
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
                  <div key={transaction.transaction_id} className="border-b border-gray-200 dark:border-slate-600 p-3 sm:p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors break-words whitespace-normal">
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{transaction.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {transaction.user_id}</p>
                      </div>
                      <span className={`inline-flex px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full flex-shrink-0 ${transaction.payment_status === "Pending" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : transaction.payment_status === "Successful" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : transaction.payment_status === "Failed" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"}`}>
                        {transaction.payment_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Transaction ID</p>
                        <p className="text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 break-words">{transaction.transaction_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Type</p>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">{transaction.transaction_type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Amount</p>
                        <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 break-words">{transaction.currency} {transaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Quantity</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{transaction.quantity_grams.toFixed(4)} g</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => openModal(transaction)} className="flex-1 min-w-[80px] px-3 py-2.5 sm:py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors min-h-[44px] sm:min-h-0">Details</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredData.length === 0 && !loading && (
                <div className="text-center py-8 sm:py-12 px-4">
                  <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white">No transactions found</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-blue bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Transaction Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Order Details Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Transaction Information</h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {selectedTransaction.name}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Transaction ID:</span> {selectedTransaction.transaction_id}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Type:</span> {selectedTransaction.transaction_type}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Value Type:</span> {selectedTransaction.value_type}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Purchase Mode:</span> {selectedTransaction.purchase_mode}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700"></div>

                {/* Financial & Payment Details */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Financial Details</h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span> {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Quantity (grams):</span> {selectedTransaction.quantity_grams.toFixed(4)}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Price per gram:</span> {selectedTransaction.price_per_gram.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Payment Mode:</span> {selectedTransaction.payment_mode}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span> {selectedTransaction.payment_status}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md min-h-[44px]"
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
