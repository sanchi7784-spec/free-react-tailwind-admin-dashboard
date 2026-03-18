import { useEffect, useState, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { fetchOrders, Order, updateOrderTracking, UpdateOrderTrackingRequest } from "../../../api/orders";

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<UpdateOrderTrackingRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Order status filter state and tab definitions
  const [activeStatus, setActiveStatus] = useState<number | null>(null);
  const statusTabs: { key: string; label: string; value: number | null }[] = [
    { key: 'all', label: 'All', value: null },
    { key: 'payment_pending', label: 'Payment Pending', value: 0 },
    { key: 'confirmed', label: 'Confirmed', value: 1 },
    { key: 'cancelled', label: 'Cancelled', value: 2 },
    { key: 'completed', label: 'Completed', value: 3 },
    { key: 'returned', label: 'Returned', value: 4 },
  ];

  const displayedOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      if (activeStatus !== null && o.order_status !== activeStatus) return false;
      if (!q) return true;
      const itemsText = (o.items || []).map(i => i.product_name).join(' ');
      const hay = `${o.order_id} ${o.user_name} ${o.email} ${o.phone} ${o.address} ${itemsText}`.toLowerCase();
      return hay.includes(q);
    });
  }, [orders, activeStatus, searchTerm]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      const token = localStorage.getItem("ecommerce_token");
      if (!token) {
        setError("No authentication token found. Please login first.");
        return;
      }
      
      const response = await fetchOrders();
      setOrders(response.data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch orders";
      setError(errorMessage);
      console.error("Error fetching orders:", err);
      console.error("Token exists:", !!localStorage.getItem("ecommerce_token"));
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Payment Pending",
      1: "Confirmed",
      2: "Cancelled",
      3: "Completed",
      4: "Returned",
    };
    return statusMap[status] || "Unknown";
  };

  const getOrderStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      1: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      2: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      3: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      4: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const getPaymentMethodText = (method: number) => {
    const methodMap: Record<number, string> = {
      1: "COD",
      2: "Online",
    };
    return methodMap[method] || "Unknown";
  };

  const getPaymentStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Payment Pending",
      1: "Paid",
      2: "Failed",
      3: "Refund Initiated",
      4: "Refunded",
    };
    return statusMap[status] || "Unknown";
  };

  const getPaymentStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      2: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      3: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      4: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Not Shipped",
      1: "Shipped",
      2: "Out for Delivery",
      3: "Delivered",
    };
    return statusMap[status] || "Unknown";
  };

  const getDeliveryStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      1: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      2: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      3: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  const handleEditOrder = (order: Order) => {
    setEditOrder(order);
    setEditForm({
      order_status: order.order_status,
      delivery_status: order.delivery_status,
      tracking_number: order.tracking_number ?? "",
      tracking_url: order.tracking_url ?? "",
      delivery_partner: order.delivery_partner ?? "",
    });
    setEditError(null);
    setEditSuccess(null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditOrder(null);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleSubmitEdit = async () => {
    if (!editOrder) return;
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const payload: UpdateOrderTrackingRequest = {
        order_status: editForm.order_status,
        delivery_status: editForm.delivery_status,
        tracking_number: editForm.tracking_number || undefined,
        tracking_url: editForm.tracking_url || undefined,
        delivery_partner: editForm.delivery_partner || undefined,
      };
      const res = await updateOrderTracking(editOrder.order_id, payload);
      setEditSuccess(res.detail || "Order updated successfully");
      // Refresh local orders list
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === editOrder.order_id
            ? {
                ...o,
                order_status: payload.order_status ?? o.order_status,
                delivery_status: payload.delivery_status ?? o.delivery_status,
                tracking_number: payload.tracking_number ?? o.tracking_number,
                tracking_url: payload.tracking_url ?? o.tracking_url,
                delivery_partner: payload.delivery_partner ?? o.delivery_partner,
              }
            : o
        )
      );
      setTimeout(() => handleCloseEditModal(), 1200);
    } catch (err: any) {
      setEditError(err.message || "Failed to update order");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="All Orders - Ecommerce" description="View all orders" />
      <PageBreadCrumb pageTitle="All Orders" />
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-200 shadow-2xl dark:border-strokedark dark:bg-gradient-to-br dark:from-boxdark dark:via-slate-900 dark:to-boxdark/80">
        <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 border-b border-slate-200 dark:border-strokedark flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-blue-50 via-fuchsia-50 to-pink-50 dark:from-blue-900 dark:via-fuchsia-900 dark:to-pink-900 rounded-t-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 dark:from-blue-300 dark:via-fuchsia-300 dark:to-pink-300">All Orders</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <div className="hidden md:flex items-center mr-3">
              <input
                type="search"
                placeholder="Search orders by any detail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-strokedark text-slate-700 dark:text-white"
              />
              <button
                onClick={() => {
                  // Export currently displayed orders
                  const rows = displayedOrders;
                  if (!rows || rows.length === 0) {
                    alert('No orders to export');
                    return;
                  }
                  const headers = ['Order ID','Date','Customer','Email','Phone','Address','Items','Tax','Total Amount','Payment Method','Payment Status','Order Status','Delivery Status'];
                  const esc = (v: any) => {
                    if (v === null || v === undefined) return '';
                    return `"${String(v).replace(/"/g,'""')}"`;
                  };
                  const out: string[] = [headers.join(',')];
                  for (const o of rows) {
                    const items = (o.items||[]).map(i=>`${i.product_name} x${i.quantity}`).join('; ');
                    const row = [
                      `#${o.order_id}`,
                      o.order_date,
                      o.user_name,
                      o.email,
                      o.phone,
                      o.address,
                      items,
                      o.tax_amount?.toFixed(2) || '0.00',
                      o.total_amount?.toFixed(2) || '0.00',
                      getPaymentMethodText(o.payment_method),
                      getPaymentStatusText(o.payment_status),
                      getOrderStatusText(o.order_status),
                      getDeliveryStatusText(o.delivery_status)
                    ].map(esc).join(',');
                    out.push(row);
                  }
                  const csv = out.join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `orders${searchTerm ? `-${searchTerm}` : ''}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="ml-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:bg-meta-4 dark:border-strokedark dark:text-white"
              >
                Export CSV
              </button>
            </div>

            <button
              onClick={loadOrders}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-center font-semibold text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center"><span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>Refreshing...</span>
              ) : "Refresh"}
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-6 md:p-10">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-300">
              {/* <p className="font-medium">Error loading orders</p> */}
              <p className="text-center text-red-600 dark:text-red-300 font-bold text-lg">Access Denied</p>
            </div>
          )}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body text-lg">No orders found.</p>
            </div>
          )}
          {!loading && !error && orders.length > 0 && (
            <>
              {/* Status filter tabs */}
              <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
                {statusTabs.map((tab) => {
                  const count = tab.value === null ? orders.length : orders.filter(o => o.order_status === tab.value).length;
                  const active = activeStatus === tab.value;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStatus(tab.value)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow transition-all duration-200 border-2 ${active ? 'bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 text-white border-transparent scale-105' : 'bg-white dark:bg-meta-4 text-slate-700 dark:text-white border-slate-200 dark:border-strokedark hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 dark:hover:from-blue-900 dark:hover:to-pink-900'}`}
                    >
                      <span>{tab.label}</span>
                      <span className={`ml-2 inline-flex h-5 sm:h-6 min-w-[20px] sm:min-w-[24px] items-center justify-center rounded-full px-1.5 sm:px-2 text-xs font-bold ${active ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700 dark:bg-meta-3 dark:text-white'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-200 dark:border-strokedark bg-white dark:bg-meta-4">
                <table className="w-full table-auto text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 via-fuchsia-100 to-pink-100 dark:from-blue-900 dark:via-fuchsia-900 dark:to-pink-900 text-left">
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Order ID</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Date</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Customer</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Contact</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Address</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Items</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Tax</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Total</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Payment Method</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Payment Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Order Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Delivery Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Delivery Partner</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Tracking Number</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Tracking URL</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="border-b border-slate-100 dark:border-strokedark hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 dark:hover:from-blue-900 dark:hover:to-pink-900 transition-all duration-150"
                      >
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-blue-600 dark:text-blue-300 text-xs sm:text-sm">#{order.order_id}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{formatDate(order.order_date)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-fuchsia-700 dark:text-fuchsia-300 text-xs sm:text-sm">{order.user_name}</span>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-300">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{order.phone}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 max-w-xs">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm line-clamp-2" title={order.address}>{order.address}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">₹{order.tax_amount.toFixed(2)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm">₹{order.total_amount.toFixed(2)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{getPaymentMethodText(order.payment_method)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold shadow ${getPaymentStatusColor(order.payment_status)}`}>{getPaymentStatusText(order.payment_status)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold shadow ${getOrderStatusColor(order.order_status)}`}>{getOrderStatusText(order.order_status)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold shadow ${getDeliveryStatusColor(order.delivery_status)}`}>{getDeliveryStatusText(order.delivery_status)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{order.delivery_partner || <span className="text-slate-400 italic">—</span>}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{order.tracking_number || <span className="text-slate-400 italic">—</span>}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap max-w-[160px]">
                          {order.tracking_url ? (
                            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm underline break-all line-clamp-1" title={order.tracking_url}>{order.tracking_url}</a>
                          ) : (
                            <span className="text-slate-400 italic text-xs sm:text-sm">—</span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-white shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-200"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" /></svg>
                            View
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit
                          </button>
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium gap-2">
              <p>Showing <span className="text-blue-600 dark:text-blue-300 font-bold">{displayedOrders.length}</span> of <span className="text-fuchsia-600 dark:text-fuchsia-300 font-bold">{orders.length}</span> orders</p>
            </div>
          )}
        </div>     </div>
 

      {/* Edit Order Modal */}
      {showEditModal && editOrder && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark px-6 py-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Edit Order #{editOrder.order_id}
              </h3>
              <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {editError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">{editError}</div>
              )}
              {editSuccess && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">{editSuccess}</div>
              )}
              {/* Order Status */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">Order Status</label>
                <select
                  value={editForm.order_status ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, order_status: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                >
                  <option value={0}>Payment Pending</option>
                  <option value={1}>Confirmed</option>
                  <option value={2}>Cancelled</option>
                  <option value={3}>Completed</option>
                  <option value={4}>Returned</option>
                </select>
              </div>
              {/* Delivery Status */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">Delivery Status</label>
                <select
                  value={editForm.delivery_status ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, delivery_status: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                >
                  <option value={0}>Not Shipped</option>
                  <option value={1}>Shipped</option>
                  <option value={2}>Out for Delivery</option>
                  <option value={3}>Delivered</option>
                </select>
              </div>
              {/* Delivery Partner */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">Delivery Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Bluedart"
                  value={editForm.delivery_partner ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, delivery_partner: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                />
              </div>
              {/* Tracking Number */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDG135"
                  value={editForm.tracking_number ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, tracking_number: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                />
              </div>
              {/* Tracking URL */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white">Tracking URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editForm.tracking_url ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, tracking_url: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-meta-4 dark:border-strokedark dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-stroke dark:border-strokedark px-6 py-4">
              <button
                onClick={handleCloseEditModal}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={editLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-bold text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
              >
                {editLoading ? (
                  <span className="flex items-center justify-center"><span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>Saving...</span>
                ) : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue bg-opacity-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-boxdark">
            <div className="sticky top-0 z-10 bg-white dark:bg-boxdark border-b border-stroke dark:border-strokedark px-8 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-blue dark:text-white">
                  Order Details - #{selectedOrder.order_id}
                </h3>
                <button
                  onClick={handleCloseViewModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-body">Name</p>
                      <p className="font-medium text-blue dark:text-white">{selectedOrder.user_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-body">Email</p>
                      <p className="font-medium text-blue dark:text-white">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-body">Phone</p>
                      <p className="font-medium text-blue dark:text-white">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-body">Delivery Address</p>
                      <p className="font-medium text-blue dark:text-white">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                    Order Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-body">Order Date</p>
                      <p className="font-medium text-blue dark:text-white">{formatDate(selectedOrder.order_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-body">Order Status</p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusColor(
                          selectedOrder.order_status
                        )}`}
                      >
                        {getOrderStatusText(selectedOrder.order_status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-body">Delivery Status</p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDeliveryStatusColor(
                          selectedOrder.delivery_status
                        )}`}
                      >
                        {getDeliveryStatusText(selectedOrder.delivery_status)}
                      </span>
                    </div>
                    {selectedOrder.delivery_partner && (
                      <div>
                        <p className="text-sm text-body">Delivery Partner</p>
                        <p className="font-medium text-blue dark:text-white">{selectedOrder.delivery_partner}</p>
                      </div>
                    )}
                    {selectedOrder.tracking_number && (
                      <div>
                        <p className="text-sm text-body">Tracking Number</p>
                        <p className="font-medium text-blue dark:text-white">{selectedOrder.tracking_number}</p>
                      </div>
                    )}
                    {selectedOrder.tracking_url && (
                      <div>
                        <p className="text-sm text-body">Tracking URL</p>
                        <a
                          href={selectedOrder.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline break-all"
                        >
                          {selectedOrder.tracking_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-body">Payment Method</p>
                    <p className="font-medium text-blue dark:text-white">{getPaymentMethodText(selectedOrder.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-body">Payment Status</p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(
                        selectedOrder.payment_status
                      )}`}
                    >
                      {getPaymentStatusText(selectedOrder.payment_status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  Order Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg border border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4"
                    >
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-24 w-24 rounded-lg object-cover shadow-md"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              Product #{item.product_id}
                            </span>
                          </div>
                          <p className="font-semibold text-blue dark:text-white text-lg mt-2">
                            {item.product_name}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="bg-white dark:bg-boxdark p-2 rounded">
                            <span className="text-body block text-xs">Unit Price</span>
                            <span className="font-bold text-blue dark:text-white">₹{item.unit_price.toFixed(2)}</span>
                          </div>
                          <div className="bg-white dark:bg-boxdark p-2 rounded">
                            <span className="text-body block text-xs">Quantity</span>
                            <span className="font-bold text-blue dark:text-white">×{item.quantity}</span>
                          </div>
                          <div className="bg-white dark:bg-boxdark p-2 rounded">
                            <span className="text-body block text-xs">Discount</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                              ₹{item.discount.toFixed(2)}
                            </span>
                          </div>
                          <div className="bg-white dark:bg-boxdark p-2 rounded">
                            <span className="text-body block text-xs">Item Total</span>
                            <span className="font-bold text-green-600 dark:text-green-400">₹{item.total_price.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Product Options */}
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-body mb-2">Product Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.options).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-boxdark px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 shadow-sm"
                                >
                                  <span className="font-semibold">{key}:</span>
                                  <span>{value}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  Order Summary
                </h4>
                <div className="bg-gray-2 dark:bg-meta-4 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-body">Subtotal</span>
                    <span className="font-medium text-blue dark:text-white">
                      ₹{(selectedOrder.total_amount - selectedOrder.tax_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body">Tax</span>
                    <span className="font-medium text-blue dark:text-white">
                      ₹{selectedOrder.tax_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stroke dark:border-strokedark">
                    <span className="text-lg font-semibold text-blue dark:text-white">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{selectedOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-boxdark border-t border-stroke dark:border-strokedark px-8 py-4">
              <button
                onClick={handleCloseViewModal}
                className="w-full rounded-md bg-primary px-6 py-3 text-white hover:bg-opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
