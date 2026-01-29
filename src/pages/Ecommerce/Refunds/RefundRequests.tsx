import { useEffect, useMemo, useState } from 'react';
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { getEcommerceToken } from '../../../utils/ecommerceAuth';
import { getPaymentMethodLabel, getPaymentStatusLabel } from '../../../utils/payment';

// Types matching API response
interface ProductInfo {
  product_id: number;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
}

interface RefundRequest {
  refund_id: number;
  refund_amount: number;
  refund_status: number;
  refund_reason: string;
  remarks: string | null;
  requested_at: string;
  processed_at: string | null;
  user_name: string;
  user_email: string;
  order_id: number;
  order_date: string;
  total_amount: number;
  payment_method: number;
  payment_status: number;
  product_info: ProductInfo | null;
}

// Modal component for displaying refund details
function RefundDetailsModal({ open, onClose, refund }: { open: boolean; onClose: () => void; refund: RefundRequest | null }) {
  if (!open || !refund) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue bg-opacity-40">
      <div className="bg-white dark:bg-boxdark rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-white">Refund Request Details</h3>
        <div className="space-y-3 text-sm">
          <div><span className="font-semibold text-gray-700 dark:text-white">Refund ID:</span> #{refund.refund_id}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Requested At:</span> {new Date(refund.requested_at).toLocaleString()}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Processed At:</span> {refund.processed_at ? new Date(refund.processed_at).toLocaleString() : '-'}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Order ID:</span> #{refund.order_id} <span className="text-xs text-gray-500">({new Date(refund.order_date).toLocaleString()})</span></div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Customer:</span> {refund.user_name}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Email:</span> {refund.user_email}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Refund Amount:</span> ₹{refund.refund_amount.toFixed(2)}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Total Order Amount:</span> ₹{refund.total_amount.toFixed(2)}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Reason:</span> {refund.refund_reason}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Remarks:</span> {refund.remarks ?? '-'}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Payment Method:</span> {getPaymentMethodLabel(refund.payment_method)}</div>
          <div><span className="font-semibold text-gray-700 dark:text-white">Payment Status:</span> {getPaymentStatusLabel(refund.payment_status)}</div>
          {refund.product_info && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-3">
                {refund.product_info.product_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={refund.product_info.product_image_url} alt={refund.product_info.product_name} className="h-14 w-14 rounded-md object-cover" />
                )}
                <div>
                  <div className="font-semibold">{refund.product_info.product_name}</div>
                  <div className="text-sm text-gray-500">Qty: {refund.product_info.quantity} • ₹{refund.product_info.unit_price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RefundRequests() {
  const [items, setItems] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeStatus, setActiveStatus] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editRemarks, setEditRemarks] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const statusTabs: { key: string; label: string; value: number | null; color: string }[] = [
    { key: 'requested', label: 'Requested', value: 0, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { key: 'approved', label: 'Approved', value: 1, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { key: 'rejected', label: 'Rejected', value: 2, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { key: 'processed', label: 'Processed', value: 3, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  ];

  // Fetch real refunds from API using token from localStorage
  useEffect(() => {
    let mounted = true;
    async function fetchRefunds() {
      setLoading(true);
      setError(null);
      try {
        const token = getEcommerceToken() || localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        if (!token) {
          setError('No auth token found in localStorage');
          setLoading(false);
          return;
        }

        const res = await fetch('https://api.mastrokart.com/dashboard/refunds', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          redirect: 'follow' as RequestRedirect,
        });

        const payload = await res.json();
        // useful for debugging in dev console
        // eslint-disable-next-line no-console
        console.debug('Refunds API response', res.status, payload);
        if (!res.ok) {
          setError(payload?.detail || 'Failed to fetch refunds');
          setLoading(false);
          return;
        }

        // payload.data is expected to be an array
        const data: RefundRequest[] = (payload.data || []).map((d: any) => ({
          refund_id: d.refund_id,
          refund_amount: Number(d.refund_amount ?? 0),
          refund_status: d.refund_status,
          refund_reason: d.refund_reason,
          remarks: d.remarks ?? null,
          requested_at: d.requested_at,
          processed_at: d.processed_at ?? null,
          user_name: d.user_name,
          user_email: d.user_email,
          order_id: d.order_id,
          order_date: d.order_date,
          total_amount: Number(d.total_amount ?? 0),
          payment_method: d.payment_method,
          payment_status: d.payment_status,
          product_info: d.product_info ?? null,
        }));

        if (mounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Network error');
          setLoading(false);
        }
      }
    }

    fetchRefunds();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (activeStatus === null) return items;
    return items.filter((i) => i.refund_status === activeStatus);
  }, [items, activeStatus]);

  const formatDate = (s: string) => s ? new Date(s).toLocaleString() : '-';

  // Update refund via PATCH using bearer token from localStorage
  async function updateRefund(payload: { refund_id: number; refund_status: number; remarks?: string | null }) {
    setUpdating(true);
    setError(null);
    try {
      const token = getEcommerceToken() || localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      if (!token) {
        setError('No auth token found in localStorage');
        setUpdating(false);
        return null;
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', `Bearer ${token}`);

      const raw = JSON.stringify({
        refund_id: payload.refund_id,
        refund_status: payload.refund_status,
        remarks: payload.remarks ?? null,
      });

      const res = await fetch('https://api.mastrokart.com/dashboard/refunds/update', {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect,
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result?.detail || result?.message || 'Failed to update refund');
        setUpdating(false);
        return null;
      }

      // update local state
      setItems((prev) => prev.map((it) => it.refund_id === payload.refund_id ? { ...it, refund_status: payload.refund_status, remarks: payload.remarks ?? it.remarks } : it));
      setEditingId(null);
      setEditRemarks('');
      setEditStatus(0);
      setUpdating(false);
      return result;
    } catch (err: any) {
      setError(err?.message || 'Network error');
      setUpdating(false);
      return null;
    }
  }

  return (
    <>
      <PageMeta title="Refund Requests - Ecommerce" description="Manage refund requests" />
      <PageBreadCrumb pageTitle="Refund Requests" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-7.5 py-6 border-b border-stroke dark:border-strokedark flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue dark:text-white">Refund Requests</h2>
        </div>

        <div className="p-7.5">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body text-lg">No refund requests.</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {statusTabs.map((tab) => {
                  const count = items.filter(i => i.refund_status === tab.value).length;
                  const active = activeStatus === tab.value;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStatus(tab.value)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm
                        ${active
                          ? `${tab.color} border-blue-500 ring-2 ring-blue-200`
                          : 'bg-white dark:bg-boxdark border-gray-200 dark:border-strokedark text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-meta-4'}`}
                    >
                      <span>{tab.label}</span>
                      <span className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-bold ${active ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700 dark:bg-meta-3 dark:text-white'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="overflow-x-auto hide-scrollbar rounded-xl shadow-lg border border-gray-100 dark:border-strokedark">
                <table className="w-full table-auto rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-meta-4 dark:to-meta-4 text-left">
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">refund_id</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">refund_amount</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">refund_status</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">refund_reason</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">remarks</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">requested_at</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">processed_at</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">user_name</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">user_email</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">order_id</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">order_date</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">total_amount</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">payment_method</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">payment_status</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">product_id</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">product_name</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">product_image_url</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">quantity</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">unit_price</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => {
                      // Color for status badge
                      let statusColor = "";
                      let statusText = String(r.refund_status);
                        switch (r.refund_status) {
                          case 0:
                            statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
                            statusText = "0 - Requested";
                            break;
                          case 1:
                            statusColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
                            statusText = "1 - Approved";
                            break;
                          case 2:
                            statusColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
                            statusText = "2 - Rejected";
                            break;
                          case 3:
                            statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
                            statusText = "3 - Processed";
                            break;
                          default:
                            statusColor = "bg-gray-200 text-gray-700 dark:bg-meta-3 dark:text-white";
                            statusText = `Unknown (${r.refund_status})`;
                        }
                      return (
                        <tr key={r.refund_id} className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-50 dark:bg-meta-4'} hover:bg-blue-50 dark:hover:bg-meta-3`}>
                          <td className="px-3 py-3 text-sm text-gray-800 dark:text-white">{r.refund_id}</td>
                          <td className="px-3 py-3 text-sm text-gray-800 dark:text-white">₹{r.refund_amount?.toFixed ? r.refund_amount.toFixed(2) : String(r.refund_amount)}</td>
                          <td className="px-3 py-3 text-sm"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}>{statusText}</span></td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-200">{r.refund_reason}</td>
                          <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-200">{r.remarks ?? '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-200">{formatDate(r.requested_at)}</td>
                          <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-200">{r.processed_at ? formatDate(r.processed_at) : '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{r.user_name}</td>
                          <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">{r.user_email}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{r.order_id}</td>
                          <td className="px-3 py-3 text-sm text-gray-500">{formatDate(r.order_date)}</td>
                          <td className="px-3 py-3 text-sm font-semibold">₹{r.total_amount?.toFixed ? r.total_amount.toFixed(2) : String(r.total_amount)}</td>
                          <td className="px-3 py-3 text-sm">{getPaymentMethodLabel(r.payment_method)}</td>
                          <td className="px-3 py-3 text-sm">{getPaymentStatusLabel(r.payment_status)}</td>
                          <td className="px-3 py-3 text-sm">{r.product_info?.product_id ?? '-'}</td>
                          <td className="px-3 py-3 text-sm">{r.product_info?.product_name ?? '-'}</td>
                          <td className="px-3 py-3 text-sm break-words"><a href={r.product_info?.product_image_url ?? '#'} target="_blank" rel="noreferrer" className="text-blue-600">{r.product_info?.product_image_url ?? '-'}</a></td>
                          <td className="px-3 py-3 text-sm">{r.product_info?.quantity ?? '-'}</td>
                          <td className="px-3 py-3 text-sm">{r.product_info?.unit_price?.toFixed ? r.product_info.unit_price.toFixed(2) : (r.product_info?.unit_price ?? '-')}</td>
                          <td className="px-3 py-3">
                            {editingId === r.refund_id ? (
                              <div className="flex flex-col gap-2">
                                <select className="rounded-md border p-1 text-sm" value={editStatus} onChange={(e) => setEditStatus(Number(e.target.value))}>
                                  <option value={0}>0 - Requested</option>
                                  <option value={1}>1 - Approved</option>
                                  <option value={2}>2 - Rejected</option>
                                  <option value={3}>3 - Processed</option>
                                </select>
                                <input className="rounded-md border p-1 text-sm" placeholder="Remarks" value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} />
                                <div className="flex gap-2">
                                  <button
                                    className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none"
                                    onClick={async () => {
                                      await updateRefund({ refund_id: r.refund_id, refund_status: editStatus, remarks: editRemarks });
                                    }}
                                    disabled={updating}
                                  >
                                    {updating ? 'Saving...' : 'Save'}
                                  </button>
                                  <button className="inline-flex items-center justify-center rounded-lg bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-300 focus:outline-none" onClick={() => { setEditingId(null); setEditRemarks(''); setEditStatus(0); }}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition" onClick={() => { setSelectedRefund(r); setModalOpen(true); }}>
                                  View
                                </button>
                                <button className="inline-flex items-center justify-center rounded-lg bg-yellow-500 px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-yellow-600 focus:outline-none" onClick={() => { setEditingId(r.refund_id); setEditStatus(r.refund_status); setEditRemarks(r.remarks ?? ''); }}>
                                  Edit
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <RefundDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} refund={selectedRefund} />
    </>
  );
}
