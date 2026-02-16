import { useEffect, useState, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { fetchOrders, Order, createOrder, OrderItem } from "../../../api/orders";
import { fetchProducts, Product } from '../../../api/products';

interface OrderItemForm extends OrderItem {
  id: string;
}

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { id: crypto.randomUUID(), product_id: 1, quantity: 1 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const [addressId, setAddressId] = useState<number>(1);
  // Add products state for price lookup
  const [products, setProducts] = useState<Product[]>([]);

  // Order status filter state and tab definitions
  const [activeStatus, setActiveStatus] = useState<number | null>(null);
  const statusTabs: { key: string; label: string; value: number | null }[] = [
    { key: 'all', label: 'All', value: null },
    { key: 'pending', label: 'Pending', value: 0 },
    { key: 'processing', label: 'Processing', value: 1 },
    { key: 'shipped', label: 'Shipped', value: 2 },
    { key: 'delivered', label: 'Delivered', value: 3 },
    { key: 'cancelled', label: 'Cancelled', value: 4 },
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

  // Compute subtotal automatically
  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const product = products.find(p => p.product_id === item.product_id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [orderItems, products]);

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
      0: "Pending",
      1: "Processing",
      2: "Shipped",
      3: "Delivered",
      4: "Cancelled",
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
      0: "Unpaid",
      1: "Paid",
      2: "Failed",
      3: "Refunded",
    };
    return statusMap[status] || "Unknown";
  };

  const getPaymentStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      2: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      3: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
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

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: crypto.randomUUID(), product_id: 1, quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: 'product_id' | 'quantity', value: number) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setCreateError(null);
      setCreateSuccess(null);

      // Validate items
      const hasInvalidItems = orderItems.some(item => item.product_id < 1 || item.quantity < 1);
      if (hasInvalidItems) {
        setCreateError("All items must have valid product ID and quantity (minimum 1)");
        setCreating(false);
        return;
      }
      if (addressId < 1) {
        setCreateError("Please select a valid address");
        setCreating(false);
        return;
      }

      const token = localStorage.getItem("ecommerce_token");
      if (!token) {
        setCreateError("No authentication token found. Please login first.");
        setCreating(false);
        return;
      }

      const body = {
        address_id: addressId,
        items: orderItems.map(({ product_id, quantity }) => ({ product_id, quantity })),
        subtotal,
        payment_method: paymentMethod
      };

      const response = await fetch("https://api.mastrokart.com/dashboard/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Failed to create order");
      }

      setCreateSuccess("Order created successfully! Order ID: " + result.data.order_id);
      // Reset form
      setOrderItems([{ id: crypto.randomUUID(), product_id: 1, quantity: 1 }]);
      setPaymentMethod(0);
      setAddressId(1);
      // Reload orders
      setTimeout(() => {
        loadOrders();
        setShowCreateModal(false);
        setCreateSuccess(null);
      }, 1500);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create order");
      console.error("Error creating order:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setCreateSuccess(null);
    setOrderItems([{ id: crypto.randomUUID(), product_id: 1, quantity: 1 }]);
    setPaymentMethod(0);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  const handleOpenCreateModal = async () => {
    setShowCreateModal(true);
    try {
      const productsRes = await fetchProducts();
      setProducts(productsRes.data);
    } catch (err) {
      setCreateError('Failed to load products.');
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
                  const headers = ['Order ID','Date','Customer','Email','Phone','Items','Amount','Payment Method','Order Status','Delivery Status'];
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
                      items,
                      o.total_amount,
                      getPaymentMethodText(o.payment_method),
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
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 px-6 py-3 text-center font-semibold text-white shadow-lg hover:from-green-500 hover:to-teal-600 transition-all duration-200 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Create Order
            </button>
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
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Items</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Amount</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Payment</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Order Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-slate-700 dark:text-white whitespace-nowrap">Delivery Status</th>
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
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm">₹{order.total_amount.toFixed(2)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-white text-xs sm:text-sm">{getPaymentMethodText(order.payment_method)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold shadow ${getOrderStatusColor(order.order_status)}`}>{getOrderStatusText(order.order_status)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold shadow ${getDeliveryStatusColor(order.delivery_status)}`}>{getDeliveryStatusText(order.delivery_status)}</span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-white shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-200"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" /></svg>
                            View
                          </button>
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
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-lg border border-stroke dark:border-strokedark"
                    >
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-blue dark:text-white text-lg">
                          {item.product_name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-body">Unit Price: </span>
                            <span className="font-medium text-blue dark:text-white">₹{item.unit_price.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-body">Quantity: </span>
                            <span className="font-medium text-blue dark:text-white">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-body">Discount: </span>
                            <span className="font-medium text-blue dark:text-white">{item.discount}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-body">Total</p>
                        <p className="text-xl font-bold text-blue dark:text-white">
                          ₹{item.total_price.toFixed(2)}
                        </p>
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

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue bg-opacity-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-blue dark:text-white mb-6">
              Create New Order
            </h3>

            {createError && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-300">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{createError}</p>
              </div>
            )}

            {createSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-300">
                <p className="font-medium">{createSuccess}</p>
              </div>
            )}

            <form onSubmit={handleCreateOrder}>
              {/* Order Items */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-blue dark:text-white">
                    Order Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <label className="block text-xs text-body mb-1">Product ID</label>
                        <input
                          type="number"
                          min="1"
                          value={item.product_id}
                          onChange={(e) => handleItemChange(item.id, 'product_id', parseInt(e.target.value) || 1)}
                          className="w-full rounded border border-stroke bg-gray px-4 py-2 text-blue focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-body mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full rounded border border-stroke bg-gray px-4 py-2 text-blue focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={orderItems.length === 1}
                        className="mt-6 text-red-600 hover:text-red-800 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue dark:text-white mb-3">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="0"
                      checked={paymentMethod === 0}
                      onChange={(e) => setPaymentMethod(parseInt(e.target.value))}
                      className="mr-2"
                    />
                    <span className="text-blue dark:text-white">Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="1"
                      checked={paymentMethod === 1}
                      onChange={(e) => setPaymentMethod(parseInt(e.target.value))}
                      className="mr-2"
                    />
                    <span className="text-blue dark:text-white">Online Payment</span>
                  </label>
                </div>
              </div>

              {/* Subtotal */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue dark:text-white mb-2">
                  Subtotal (₹)
                </label>
                <input
                  type="number"
                  value={subtotal}
                  readOnly
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-blue focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-md border border-stroke px-6 py-2.5 text-blue hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-6 py-2.5 text-white hover:bg-opacity-90 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
