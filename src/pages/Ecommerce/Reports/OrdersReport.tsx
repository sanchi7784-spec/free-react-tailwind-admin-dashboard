import React, { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";

type Order = {
  order_id: number;
  order_amount: number;
  tax_amount: number;
  delivery_charge: number;
  order_status: number;
  payment_status: number;
  payment_method: number;
};

type ApiResponse = {
  detail?: string;
  data?: {
    overall_counts?: Record<string, number>;
    payment_summary?: Record<string, number>;
    orders?: Order[];
    daily_order_amount?: Array<{ date: string; total_order_amount: number }>;
  };
};

export default function OrdersReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse["data"] | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("ecommerce_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt");

      if (!token) {
        setError("Authentication token not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch("https://api.mastrokart.com/dashboard/order-reports", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`API error: ${resp.status} ${txt}`);
        }

        const json: ApiResponse = await resp.json();
        setData(json.data ?? null);
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const statusLabel = (s: number) => {
    switch (s) {
      case 0:
        return "Placed";
      case 1:
        return "Confirmed";
      case 2:
        return "Cancelled";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const paymentStatusLabel = (s: number) => {
    switch (s) {
      case 0:
        return "Pending";
      case 1:
        return "Paid";
      case 2:
        return "Refund Initiated";
      case 3:
        return "Refunded";
      case 4:
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const paymentMethodLabel = (m: number) => {
    switch (m) {
      case 0:
        return "Online";
      case 1:
        return "Cash on Delivery";
      default:
        return "Other";
    }
  };

  const exportCSV = () => {
    if (!data || !data.orders) return;
    const headers = [
      "order_id",
      "order_amount",
      "tax_amount",
      "delivery_charge",
      "order_status",
      "payment_status",
      "payment_method",
    ];

    const rows = data.orders.map((o) => [
      o.order_id,
      o.order_amount,
      o.tax_amount,
      o.delivery_charge,
      statusLabel(o.order_status),
      paymentStatusLabel(o.payment_status),
      paymentMethodLabel(o.payment_method),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageMeta title="Orders Report - Dashboard" description="Orders report" />
      <PageBreadCrumb pageTitle="Order Reports" />

      <div className="rounded-sm border border-stroke bg-white px-6 py-6 shadow-default">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Order Reports</h3>
            <p className="text-sm text-gray-500">Overview of orders and fulfilment.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-white text-sm hover:opacity-90"
              disabled={!data || !data.orders || data.orders.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="py-4 text-sm text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-md border p-4">
                <div className="text-xs text-gray-500">Total Orders</div>
                <div className="text-xl font-semibold">
                  {data?.overall_counts?.total_orders ?? "-"}
                </div>
                <div className="text-sm text-gray-500">Placed: {data?.overall_counts?.placed ?? 0}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-xs text-gray-500">Payment Summary</div>
                <div className="text-xl font-semibold">{data?.payment_summary?.total_order_amount ?? "-"}</div>
                <div className="text-sm text-gray-500">Pending: {data?.payment_summary?.pending ?? 0}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-xs text-gray-500">Paid</div>
                <div className="text-xl font-semibold">{data?.payment_summary?.paid ?? 0}</div>
                <div className="text-sm text-gray-500">Refunded: {data?.payment_summary?.refunded ?? 0}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-xs text-gray-500">Refund Initiated</div>
                <div className="text-xl font-semibold">{data?.payment_summary?.refund_initiated ?? 0}</div>
                <div className="text-sm text-gray-500">Cancelled: {data?.overall_counts?.cancelled ?? 0}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-3 py-2">Order ID</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Tax</th>
                    <th className="px-3 py-2">Delivery</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Payment</th>
                    <th className="px-3 py-2">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orders && data.orders.length > 0 ? (
                    data.orders.map((o) => (
                      <tr key={o.order_id} className="border-t">
                        <td className="px-3 py-2">{o.order_id}</td>
                        <td className="px-3 py-2">{o.order_amount}</td>
                        <td className="px-3 py-2">{o.tax_amount}</td>
                        <td className="px-3 py-2">{o.delivery_charge}</td>
                        <td className="px-3 py-2">{statusLabel(o.order_status)}</td>
                        <td className="px-3 py-2">{paymentStatusLabel(o.payment_status)}</td>
                        <td className="px-3 py-2">{paymentMethodLabel(o.payment_method)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
