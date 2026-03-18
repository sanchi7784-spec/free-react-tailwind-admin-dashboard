import { useEffect, useMemo, useState } from "react";
import { Eye, X, CreditCard, TrendingUp, IndianRupee, ShoppingBag, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { fetchPayments, Payment } from "../../../api/payments";

// ─── helpers ────────────────────────────────────────────────────────────────

const PAYMENT_STATUS_MAP: Record<number, { label: string; cls: string }> = {
  0: { label: "Pending", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  1: { label: "Success", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  2: { label: "Failed", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const ORDER_STATUS_MAP: Record<number, { label: string; cls: string }> = {
  0: { label: "Placed", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  1: { label: "Shipped", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  2: { label: "Delivered", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  3: { label: "Cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  4: { label: "Returned", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const GATEWAY_LABEL: Record<string, string> = {
  cashfree: "Cashfree",
  cod: "Cash on Delivery",
  razorpay: "Razorpay",
};

function fmtCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

function fmtDate(dt: string) {
  return new Date(dt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ map, code }: { map: Record<number, { label: string; cls: string }>; code: number }) {
  const entry = map[code] ?? { label: `Status ${code}`, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

function PaymentDetailModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Payment #{payment.payment_id}</h2>
            <p className="text-violet-200 text-sm mt-0.5">Order #{payment.order.order_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
              <p className="text-lg font-bold text-violet-700 dark:text-violet-300">{fmtCurrency(payment.payment.amount, payment.payment.currency)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Commission</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{fmtCurrency(payment.commission, payment.payment.currency)}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment</p>
              <StatusBadge map={PAYMENT_STATUS_MAP} code={payment.payment.payment_status} />
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order</p>
              <StatusBadge map={ORDER_STATUS_MAP} code={payment.order.order_status} />
            </div>
          </div>

          {/* Customer Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Customer</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Row label="Name" value={payment.user.name} />
              <Row label="Email" value={payment.user.email} />
              <Row label="Phone" value={payment.user.phone} />
              <Row label="User ID" value={String(payment.user.user_id)} />
            </div>
          </section>

          {/* Payment Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Payment Details</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Row label="Gateway" value={GATEWAY_LABEL[payment.payment.gateway] ?? payment.payment.gateway} />
              <Row label="Currency" value={payment.payment.currency} />
              <Row label="Merchant Order ID" value={payment.payment.merchant_order_id} mono />
              <Row label="Gateway Payment ID" value={payment.payment.gateway_payment_id ?? "—"} mono />
              <Row label="Date" value={fmtDate(payment.payment.created_at)} />
              <Row label="Method ID" value={String(payment.payment.payment_method_id)} />
            </div>
          </section>

          {/* Order Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Order Details</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Row label="Subtotal" value={fmtCurrency(payment.order.subtotal, payment.payment.currency)} />
              <Row label="Tax" value={fmtCurrency(payment.order.tax_amount, payment.payment.currency)} />
              <Row label="Delivery" value={fmtCurrency(payment.order.delivery_charge, payment.payment.currency)} />
              <Row label="Total" value={fmtCurrency(payment.order.total_amount, payment.payment.currency)} bold />
              {payment.order.tracking_number && <Row label="Tracking #" value={payment.order.tracking_number} mono />}
              {payment.order.delivery_partner && <Row label="Partner" value={payment.order.delivery_partner} />}
              {payment.order.tracking_url && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Tracking URL</span>
                  <a href={payment.order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 dark:text-violet-400 hover:underline break-all">
                    {payment.order.tracking_url}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Items */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Items ({payment.items.length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Product</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Qty</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Unit Price</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Discount (Rs)</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {payment.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.product_name}</p>
                        <p className="text-xs text-gray-400">ID: {item.product_id}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{fmtCurrency(item.unit_price)}</td>
                      <td className="px-4 py-3 text-right">
                        {item.discount > 0 ? (
                          <span className="text-red-500">-{fmtCurrency(item.discount, payment.payment.currency)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-200">{fmtCurrency(item.total_price)}</td>
                      <td className="px-4 py-3">
                        {Object.keys(item.options).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.options).map(([k, v]) => (
                              <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs">
                                <span className="font-medium">{k}:</span> {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false, bold = false }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div>
      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">{label}</span>
      <span className={`text-sm text-gray-800 dark:text-gray-200 break-all ${mono ? "font-mono" : ""} ${bold ? "font-bold" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "0" | "1" | "2">("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchPayments()
      .then((res) => setPayments(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // derive unique gateways
  const gateways = useMemo(() => {
    const s = new Set(payments.map((p) => p.payment.gateway));
    return Array.from(s);
  }, [payments]);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        String(p.payment_id).includes(q) ||
        String(p.order.order_id).includes(q) ||
        p.user.name.toLowerCase().includes(q) ||
        p.user.email.toLowerCase().includes(q) ||
        p.user.phone.includes(q) ||
        p.payment.merchant_order_id.toLowerCase().includes(q) ||
        (p.payment.gateway_payment_id ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || String(p.payment.payment_status) === statusFilter;
      const matchGateway = gatewayFilter === "all" || p.payment.gateway === gatewayFilter;
      return matchSearch && matchStatus && matchGateway;
    });
  }, [payments, search, statusFilter, gatewayFilter]);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, gatewayFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage]);

  const visiblePages = useMemo(() => {
    const windowSize = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + windowSize - 1);
    const adj = Math.max(1, end - windowSize + 1);
    const pages: number[] = [];
    for (let i = adj; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  // Summary stats
  const stats = useMemo(() => {
    const total = payments.length;
    const totalRevenue = payments.reduce((s, p) => s + p.payment.amount, 0);
    const totalCommission = payments.reduce((s, p) => s + p.commission, 0);
    const success = payments.filter((p) => p.payment.payment_status === 1).length;
    const failed = payments.filter((p) => p.payment.payment_status === 2).length;
    const pending = payments.filter((p) => p.payment.payment_status === 0).length;
    const uniqueUsers = new Set(payments.map((p) => p.user.user_id)).size;
    return { total, totalRevenue, totalCommission, success, failed, pending, uniqueUsers };
  }, [payments]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CreditCard size={26} className="text-violet-600" /> Payments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All payment transactions across orders
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard
          icon={<IndianRupee size={20} />}
          label="Total Revenue"
          value={fmtCurrency(stats.totalRevenue)}
          color="violet"
        />
        <SummaryCard
          icon={<TrendingUp size={20} />}
          label="Commission"
          value={fmtCurrency(stats.totalCommission)}
          color="indigo"
        />
        <SummaryCard
          icon={<ShoppingBag size={20} />}
          label="Transactions"
          value={String(stats.total)}
          color="blue"
        />
        <SummaryCard
          icon={<CheckCircle size={20} />}
          label="Successful"
          value={String(stats.success)}
          color="green"
        />
        <SummaryCard
          icon={<XCircle size={20} />}
          label="Failed"
          value={String(stats.failed)}
          color="red"
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Unique Users"
          value={String(stats.uniqueUsers)}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, user, order ID, merchant order ID…"
          className="flex-1 min-w-[240px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {/* Payment status tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {(["all", "0", "1", "2"] as const).map((s) => {
            const labels = { all: "All", "0": "Pending", "1": "Success", "2": "Failed" };
            const counts = {
              all: payments.length,
              "0": stats.pending,
              "1": stats.success,
              "2": stats.failed,
            };
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {labels[s]} <span className="opacity-70">({counts[s]})</span>
              </button>
            );
          })}
        </div>
        {/* Gateway filter */}
        <select
          value={gatewayFilter}
          onChange={(e) => setGatewayFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Gateways</option>
          {gateways.map((g) => (
            <option key={g} value={g}>{GATEWAY_LABEL[g] ?? g}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">#</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Payment ID</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Order ID</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Customer</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Gateway</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Amount</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Commission</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Pay Status</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Order Status</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Items</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Date</th>
                    <th className="text-center px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center py-16 text-gray-400 dark:text-gray-500">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p, idx) => (
                      <tr
                        key={p.payment_id}
                        className="hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors"
                      >
                        <td className="px-4 py-3.5 text-gray-400 dark:text-gray-500 text-xs">
                          {(currentPage - 1) * perPage + idx + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                            #{p.payment_id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded text-indigo-700 dark:text-indigo-300">
                            #{p.order.order_id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{p.user.name}</p>
                          <p className="text-xs text-gray-400">{p.user.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.payment.gateway === "cod"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300"
                          }`}>
                            {GATEWAY_LABEL[p.payment.gateway] ?? p.payment.gateway}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-gray-800 dark:text-gray-200">
                          {fmtCurrency(p.payment.amount, p.payment.currency)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-violet-600 dark:text-violet-400 font-medium">
                          {fmtCurrency(p.commission, p.payment.currency)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <StatusBadge map={PAYMENT_STATUS_MAP} code={p.payment.payment_status} />
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <StatusBadge map={ORDER_STATUS_MAP} code={p.order.order_status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-0.5 max-w-[180px]">
                            {p.items.slice(0, 2).map((it, i) => (
                              <span key={i} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {it.quantity}× {it.product_name}
                              </span>
                            ))}
                            {p.items.length > 2 && (
                              <span className="text-xs text-gray-400">+{p.items.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {fmtDate(p.payment.created_at)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => setSelectedPayment(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors"
                          >
                            <Eye size={13} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} payments (total {payments.length})
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                {visiblePages.map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      pg === currentPage
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  violet: "from-violet-500 to-violet-600",
  indigo: "from-indigo-500 to-indigo-600",
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  red: "from-red-500 to-red-600",
  orange: "from-orange-500 to-orange-600",
};

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
