import { useEffect, useState } from "react";
import { WalletTransaction } from "../../types/wallet";
import { fetchWalletTransactions } from "../../api/wallet";
const PER_PAGE = 10;
const GoldRedeemUnits = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWalletTransactions();
        if (!mounted) return;
        setTransactions(res.transactions || []);
      } catch (err: any) {
        setError(err?.detail || err?.message || "Failed to fetch transactions");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const total = transactions.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Wallet Transactions History
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPage(1); /* refresh */ window.location.reload(); }}
            className="px-4 py-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-500 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{total}</div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Page {page} / {maxPage}</div>
        </div>
        {/* Loading / Error */}
        {loading && (
          <div className="p-6 text-center text-sm text-gray-600 dark:text-gray-300">Loading transactions...</div>
        )}

        {error && (
          <div className="p-6 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Desktop Table: horizontal + vertical internal scrolling with sticky header */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto no-scrollbar">
                <div className="min-w-full inline-block align-middle">
                  <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                    <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-stone-900 text-white">
                    <th className="px-4 py-3 text-left text-sm font-bold">Txn ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Wallet</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">User</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Txn Type</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Event</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">Balance After</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">Gold (g)</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">Live Price</th>
                    <th className="px-4 py-3 text-right text-sm font-bold">Gold Bal After</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Sender</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Receiver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {current.map((t) => (
                    <tr key={t.transaction_id} className="hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{t.transaction_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.wallet_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.user_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.name ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.transaction_type ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.source_type ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.event_type ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{t.amount != null ? t.amount.toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{t.balance_after != null ? t.balance_after.toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{t.gold_grams != null ? t.gold_grams : "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{t.live_price != null ? t.live_price.toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{t.gold_balance_after != null ? t.gold_balance_after : "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${t.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300'}`}>
                          {t.status ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.sender_user_id ?? '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t.receiver_user_id ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden">
              {current.map((t) => (
                <div key={t.transaction_id} className="border-b border-gray-200 dark:border-slate-700 p-4 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.transaction_type ?? t.source_type ?? 'Transaction'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.name ?? "-"} — #{t.transaction_id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.amount != null ? t.amount.toLocaleString() : '-'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Balance: {t.balance_after != null ? t.balance_after.toLocaleString() : '-'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div><strong>Wallet:</strong> {t.wallet_id}</div>
                    <div><strong>User:</strong> {t.user_id}</div>
                    <div><strong>Event:</strong> {t.event_type ?? '-'}</div>
                    <div><strong>Gold (g):</strong> {t.gold_grams ?? '-'}</div>
                    <div><strong>Live Price:</strong> {t.live_price != null ? t.live_price.toLocaleString() : '-'}</div>
                    <div><strong>Gold Bal After:</strong> {t.gold_balance_after ?? '-'}</div>
                    <div><strong>Sender:</strong> {t.sender_user_id ?? '-'}</div>
                    <div><strong>Receiver:</strong> {t.receiver_user_id ?? '-'}</div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Source: {t.source_type ?? '-'}</div>
                    <div>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${t.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300'}`}>
                        {t.status ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">Showing {(page - 1) * PER_PAGE + 1} - {Math.min(page * PER_PAGE, total)} of {total}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-300 dark:border-slate-700 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  disabled={page === maxPage}
                  className="px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-300 dark:border-slate-700 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoldRedeemUnits;
