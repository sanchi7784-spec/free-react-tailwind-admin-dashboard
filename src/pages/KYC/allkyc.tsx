import { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { fetchAllKycRecords, updateKycVerification } from "../../api/kyc";
import type { KycRecordApi } from "../../types/kyc";

export default function AllKYCLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedKYC, setSelectedKYC] = useState<KycRecordApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycRecords, setKycRecords] = useState<KycRecordApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllKycRecords();
        if (!mounted) return;
        setKycRecords(data.kyc_records || []);
      } catch (err: any) {
        setError(err?.detail || err?.message || "Failed to fetch KYC records");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleViewDetails = (kyc: KycRecordApi) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
    setShowRejectReason(false);
    setRejectReason("");
  };

  const refreshKycList = async () => {
    try {
      const data = await fetchAllKycRecords();
      setKycRecords(data.kyc_records || []);
      if (selectedKYC) {
        const updated = (data.kyc_records || []).find((r) => r.kyc_id === selectedKYC.kyc_id) || null;
        setSelectedKYC(updated);
      }
    } catch (err: any) {
      // keep existing error handling elsewhere
    }
  };

  const mapStatus = (r: KycRecordApi) => {
    if (r.is_verified === 1) return "Approved" as const;
    if (r.is_verified === 0) return "Pending" as const;
    if (r.is_verified === 2) return "Rejected" as const;
    return "Pending" as const;
  };

  const filteredRecords = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return kycRecords.filter((record) => {
      const mapped = mapStatus(record);
      const matchesStatus = statusFilter === "All" || mapped === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;

      const haystack = `${record.kyc_id} ${record.user_id} ${record.name} ${record.email} ${record.aadhaar_number ?? ''} ${record.pan_number ?? ''} ${record.reason ?? ''} ${record.created_at ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [kycRecords, searchTerm, statusFilter]);

  const exportCSV = (rows: typeof kycRecords) => {
    if (!rows || rows.length === 0) {
      alert('No KYC records to export');
      return;
    }

    const headers = ['KYC ID','User ID','Name','Email','Aadhaar','PAN','Status','Reason','Verified At','Created At'];
    const escapeCell = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g,'""');
      return `"${s}"`;
    };

    const rowsOut = [headers.join(',')];
    for (const r of rows) {
      const row = [
        r.kyc_id,
        r.user_id,
        r.name,
        r.email,
        r.aadhaar_number ?? '',
        r.pan_number ?? '',
        mapStatus(r),
        r.reason ?? '',
        r.verified_at ?? '',
        r.created_at ?? ''
      ].map(escapeCell).join(',');
      rowsOut.push(row);
    }

    const csvString = rowsOut.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-records${searchTerm ? `-${searchTerm}` : ''}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {status}
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusHeaderGradient = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-violet-600 to-purple-600";
      case "Approved":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "Rejected":
        return "bg-gradient-to-r from-red-600 to-rose-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const getStatusBannerGradient = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-amber-600 to-amber-500";
      case "Approved":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "Rejected":
        return "bg-gradient-to-r from-red-600 to-rose-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const statusCounts = {
    All: kycRecords.length,
    Pending: kycRecords.filter((r) => mapStatus(r) === "Pending").length,
    Approved: kycRecords.filter((r) => mapStatus(r) === "Approved").length,
    Rejected: kycRecords.filter((r) => mapStatus(r) === "Rejected").length,
  };

  const modalStatus = selectedKYC ? mapStatus(selectedKYC) : "Pending";

  return (
    <>
      <PageMeta title="All KYC Logs - Admin" description="View and manage all KYC submissions" />
      <div>
        <PageBreadcrumb pageTitle="All KYC Logs" />

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  All KYC Submissions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Complete log of all KYC documents
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search KYC by any detail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportCSV(filteredRecords)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={refreshKycList}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? status === "Pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/50"
                        : status === "Approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-2 ring-green-500/50"
                        : status === "Rejected"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 ring-2 ring-red-500/50"
                        : "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 ring-2 ring-violet-500/50"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            {loading && (
              <div className="text-center py-6">
                <div className="text-sm text-gray-600 dark:text-gray-300">Loading KYC records...</div>
              </div>
            )}
            {error && (
              <div className="text-center py-6">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.kyc_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {record.name}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        KYC Documents
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(mapStatus(record))}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                            mapStatus(record) === "Pending"
                              ? "bg-violet-600 hover:bg-violet-700"
                              : mapStatus(record) === "Approved"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No KYC records found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter.
                </p>
              </div>
            )}
          </div>
          {/* Pagination Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing 1 to {Math.min(itemsPerPage, filteredRecords.length)} of{" "}
                {filteredRecords.length} entries
              </div>
            </div>
          </div>
        </div>
        {/* Responsive Beautiful Modal */}
        {isModalOpen && selectedKYC && (
          <div
            className="fixed inset-0 bg-blue/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div
                className={
                  "sticky top-0 " +
                  getStatusHeaderGradient(modalStatus) +
                  " px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10 shadow-lg"
                }
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                    KYC Document Review
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 mt-1">
                    {modalStatus === "Pending"
                      ? "Pending review"
                      : modalStatus === "Approved"
                      ? "Approved submission"
                      : "Rejected submission"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {modalStatus !== "Approved" && (
                    <button
                      onClick={async () => {
                        if (!selectedKYC) return;
                        setActionLoading(true);
                        setActionError(null);
                        try {
                          await updateKycVerification(selectedKYC.kyc_id, 1, null);
                          await refreshKycList();
                        } catch (err: any) {
                          setActionError(err?.detail || err?.message || "Approve failed");
                        } finally {
                          setActionLoading(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                      disabled={actionLoading}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowRejectReason(true);
                      setActionError(null);
                    }}
                    className={
                      modalStatus === "Rejected"
                        ? "inline-flex items-center gap-2 px-3 py-2 bg-white text-red-600 hover:bg-white/90 text-sm font-medium rounded-lg shadow"
                        : "inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-2 text-white hover:bg-white/20 transition-all p-2 sm:p-2.5 rounded-full duration-200 flex-shrink-0"
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  </button>
                </div>
              </div>
              {/* Modal Body */}
              <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-80px)]">
                {/* Status Banner with Icon */}
                <div
                  className={
                    getStatusBannerGradient(modalStatus) +
                    " text-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg"
                  }
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center">
                      {modalStatus === "Pending" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ) : modalStatus === "Approved" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">
                        {modalStatus === "Pending"
                          ? "Waiting For Approval"
                          : modalStatus === "Approved"
                          ? "Application Approved"
                          : "Application Rejected"}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 truncate">
                        KYC submission for {selectedKYC.name} ({selectedKYC.email})
                      </p>
                    </div>
                  </div>
                </div>
                {/* Approval/Rejection Info */}
                {modalStatus === "Approved" && selectedKYC.verified_at && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg sm:rounded-xl shadow-md">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600 dark:text-green-400 sm:w-6 sm:h-6"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-bold text-green-900 dark:text-green-200 mb-2">
                          Approval Information
                        </h5>
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="font-medium">Verified on:</span>{" "}
                            <span className="truncate">{selectedKYC.verified_at}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {modalStatus === "Rejected" && selectedKYC.reason && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl shadow-md">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-600 dark:text-red-400 sm:w-6 sm:h-6"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm sm:text-base font-bold text-red-900 dark:text-red-200 mb-2">
                          Rejection Reason
                        </h5>
                        <p className="text-xs sm:text-base text-red-800 dark:text-red-300 mb-3">
                          {selectedKYC.reason}
                        </p>
                        {selectedKYC.verified_at && (
                          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Processed on: {selectedKYC.verified_at}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Reject reason input (shows only when rejecting) */}
                {showRejectReason && (
                  <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Rejection Reason</h4>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection"
                      className="w-full min-h-[100px] p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (!selectedKYC) return;
                          if (!rejectReason.trim()) {
                            setActionError("Please enter a rejection reason.");
                            return;
                          }
                          setActionLoading(true);
                          setActionError(null);
                          try {
                            await updateKycVerification(selectedKYC.kyc_id, 2, rejectReason.trim());
                            await refreshKycList();
                            setShowRejectReason(false);
                            setRejectReason("");
                          } catch (err: any) {
                            setActionError(err?.detail || err?.message || "Reject failed");
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        disabled={actionLoading}
                      >
                        Submit Rejection
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectReason(false);
                          setRejectReason("");
                          setActionError(null);
                        }}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                        disabled={actionLoading}
                      >
                        Cancel
                      </button>
                      {actionError && <div className="text-sm text-red-600 ml-3">{actionError}</div>}
                    </div>
                  </div>
                )}
                {/* Document Sections - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {/* Aadhaar Card Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7 flex-shrink-0"
                        >
                          <rect x="0" y="4" width="24" height="16" rx="2" />
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <path d="M3 10h18" />
                        </svg>
                        <h3 className="text-base sm:text-xl font-bold text-white">Aadhaar Card</h3>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {selectedKYC.created_at}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Aadhaar Number
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.aadhaar_number ?? "-"}
                          </p>
                        </div>
                      </div>
                      {/* Front Page with Hover Effect */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Front Page
                        </p>
                        {selectedKYC.aadhaar_front_url ? (
                          <a
                            href={selectedKYC.aadhaar_front_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                          >
                            <img
                              src={selectedKYC.aadhaar_front_url}
                              alt="Aadhaar Front"
                              className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </div>
                          </a>
                        ) : (
                          <div className="w-full h-40 sm:h-56 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                      </div>
                      {/* Back Page with Hover Effect */}
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Back Page
                        </p>
                        {selectedKYC.aadhaar_back_url ? (
                          <a
                            href={selectedKYC.aadhaar_back_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                          >
                            <img
                              src={selectedKYC.aadhaar_back_url}
                              alt="Aadhaar Back"
                              className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </div>
                          </a>
                        ) : (
                          <div className="w-full h-40 sm:h-56 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* PAN Card Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="sm:w-7 sm:h-7 flex-shrink-0"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3 className="text-base sm:text-xl font-bold text-white">PAN Card</h3>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      {/* Document Information Cards */}
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Submission Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {selectedKYC.created_at}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            PAN Number
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                            {selectedKYC.pan_number ?? "-"}
                          </p>
                        </div>
                      </div>
                      {/* Front Page with Hover Effect */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Front Page
                        </p>
                        {selectedKYC.pan_image_url ? (
                          <a
                            href={selectedKYC.pan_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-lg sm:rounded-xl overflow-hidden"
                          >
                            <img
                              src={selectedKYC.pan_image_url}
                              alt="PAN Front"
                              className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-blue/0 group-hover:bg-blue/40 transition-all duration-300 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:w-12 sm:h-12"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </div>
                          </a>
                        ) : (
                          <div className="w-full h-40 sm:h-56 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                      </div>
                      {/* PAN back removed — API does not provide a separate PAN back image */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}