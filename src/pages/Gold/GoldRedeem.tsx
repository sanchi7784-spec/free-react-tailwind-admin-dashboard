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
          try {
            const json = text ? JSON.parse(text) : null;
            throw new Error(json?.detail || `${res.status} ${res.statusText}`);
          } catch {
            throw new Error(text || `${res.status} ${res.statusText}`);
          }
        }
        const data: ApiResponse = await res.json();
        setTransactions(data.transactions || []);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.detail || err.detail || "Failed to fetch");
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
      setDateError(err?.detail || "Invalid date range");
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Gold Transaction History
          </h1>
        </div>
        {/* Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
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
              <option value="Pending">Pending</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Failed</option>
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
              <button type="button" onClick={applyDateFilter} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
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
            {dateError && <p className="mt-2 text-sm text-red-600">{dateError}</p>}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          {/* Loading / Error */}
          <div className="p-4">
            {loading && (
              <div className="text-center py-6 text-sm text-gray-600 dark:text-gray-300">Loading transactions...</div>
            )}
            {error && (
              <div className="text-center py-6 text-sm text-red-600">Error: {error}</div>
            )}
          </div>

          <div className="max-h-[60vh] overflow-auto relative">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-indigo-600 text-white sticky top-0 z-10">
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">User</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Trx ID</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Type</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Value Type</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Purchase Mode</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Quantity (g)</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Price/g</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Payment Mode</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((transaction, index) => (
                    <tr
                      key={transaction.transaction_id}
                      className={`${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"} hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors`}
                    >
                      <td className="px-4 py-4 break-words whitespace-normal">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{transaction.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">ID: {transaction.user_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 break-words whitespace-normal">
                        <span className="text-sm font-mono text-gray-700 dark:text-gray-300 break-words">{transaction.transaction_id}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.transaction_type}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.value_type}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.purchase_mode}</td>
                      <td className="px-4 py-4 break-words whitespace-normal">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.currency} {transaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.quantity_grams.toFixed(4)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.price_per_gram.toLocaleString(undefined, {maximumFractionDigits:2})}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white break-words whitespace-normal">{transaction.payment_mode}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${transaction.payment_status === "Pending" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : transaction.payment_status === "Successful" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : transaction.payment_status === "Failed" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"}`}>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 min-w-0">
                        <div className="flex gap-2">
                          <button onClick={() => openModal(transaction)} className="px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors whitespace-nowrap">Details</button>
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
                <div key={transaction.transaction_id} className="border-b border-gray-200 dark:border-slate-600 p-4 hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors break-words whitespace-normal">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{transaction.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {transaction.user_id}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${transaction.payment_status === "Pending" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : transaction.payment_status === "Successful" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : transaction.payment_status === "Failed" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"}`}>
                      {transaction.payment_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction ID</p>
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-words">{transaction.transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                      <p className="text-sm text-gray-900 dark:text-white break-words">{transaction.transaction_type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 break-words">{transaction.currency} {transaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.quantity_grams.toFixed(4)} g</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => openModal(transaction)} className="flex-1 min-w-[80px] px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">Details</button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredData.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
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
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Transaction Details</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {selectedTransaction.name}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Transaction ID:</span> {selectedTransaction.transaction_id}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Type:</span> {selectedTransaction.transaction_type}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Value Type:</span> {selectedTransaction.value_type}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Purchase Mode:</span> {selectedTransaction.purchase_mode}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700"></div>

                {/* Financial & Payment Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Financial Details</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span> {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Quantity (grams):</span> {selectedTransaction.quantity_grams.toFixed(4)}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Price per gram:</span> {selectedTransaction.price_per_gram.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Payment Mode:</span> {selectedTransaction.payment_mode}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Payment Status:</span> {selectedTransaction.payment_status}</p>
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
