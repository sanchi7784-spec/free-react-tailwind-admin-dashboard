import { useState, useEffect, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Badge from "../../../components/ui/badge/Badge";
import { getEcommerceToken } from "../../../utils/ecommerceAuth";
import { getAllKYC, updateKYCStatus, KYCDocument } from "../../../api/ecommerceKyc";

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type ViewMode = "table" | "grid";

export default function AllKYC() {
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedKyc, setSelectedKyc] = useState<KYCDocument | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionStatus, setActionStatus] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch KYC documents
  useEffect(() => {
    fetchKYCDocuments();
  }, []);

  const fetchKYCDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getEcommerceToken();
      if (!token) {
        setError("Please login to access ecommerce features");
        return;
      }
      const data = await getAllKYC(token);
      setKycDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
      setError("Access Denied");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search KYC documents
  const filteredDocuments = useMemo(() => {
    return kycDocuments.filter((kyc) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && kyc.is_verified === 0) ||
        (statusFilter === "approved" && kyc.is_verified === 1) ||
        (statusFilter === "rejected" && kyc.is_verified === 2);

      const matchesSearch =
        searchTerm === "" ||
        kyc.aadhaar_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.pan_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [kycDocuments, statusFilter, searchTerm]);

  // Get status badge
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge color="warning">Pending</Badge>;
      case 1:
        return <Badge color="success">Approved</Badge>;
      case 2:
        return <Badge color="error">Rejected</Badge>;
      default:
        return <Badge color="light">Unknown</Badge>;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (status: number) => {
    if (!selectedKyc) return;

    try {
      const token = getEcommerceToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      await updateKYCStatus(token, selectedKyc.kyc_id, status, remarks);
      setShowModal(false);
      setSelectedKyc(null);
      setRemarks("");
      fetchKYCDocuments();
    } catch (error) {
      console.error("Error updating KYC status:", error);
      setError("Failed to update KYC status");
    }
  };

  // Open modal for action
  const openActionModal = (kyc: KYCDocument, status: number) => {
    setSelectedKyc(kyc);
    setActionStatus(status);
    setRemarks("");
    setShowModal(true);
  };

  // View document
  const viewDocument = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = kycDocuments.length;
    const pending = kycDocuments.filter((k) => k.is_verified === 0).length;
    const approved = kycDocuments.filter((k) => k.is_verified === 1).length;
    const rejected = kycDocuments.filter((k) => k.is_verified === 2).length;
    return { total, pending, approved, rejected };
  }, [kycDocuments]);

  return (
    <>
      <PageMeta title="All KYC Documents | Ecommerce" description="Manage and review all KYC documents for ecommerce users" />
      <PageBreadCrumb pageTitle="All KYC Documents" />

      <div className="p-4 md:p-6 2xl:p-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="text-title-md font-bold text-blue dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm font-medium">Total KYC</div>
          </div>
          <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="text-title-md font-bold text-yellow-600 dark:text-yellow-500">
              {stats.pending}
            </div>
            <div className="text-sm font-medium">Pending</div>
          </div>
          <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="text-title-md font-bold text-green-600 dark:text-green-500">
              {stats.approved}
            </div>
            <div className="text-sm font-medium">Approved</div>
          </div>
          <div className="rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="text-title-md font-bold text-red-600 dark:text-red-500">
              {stats.rejected}
            </div>
            <div className="text-sm font-medium">Rejected</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-500 px-4 py-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Header with Filters */}
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-white"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-white"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === "approved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-white"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setStatusFilter("rejected")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-white"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, aadhaar, or PAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 rounded-md border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-strokedark"
              />
              <button
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                className="rounded-md border border-stroke px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
              >
                {viewMode === "table" ? "Grid" : "Table"}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Table View */}
          {!loading && viewMode === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[80px] px-4 py-4 font-medium text-blue dark:text-white">
                      KYC ID
                    </th>
                    <th className="min-w-[180px] px-4 py-4 font-medium text-blue dark:text-white">
                      User Name
                    </th>
                    <th className="min-w-[130px] px-4 py-4 font-medium text-blue dark:text-white">
                      Aadhaar Number
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-blue dark:text-white">
                      PAN Number
                    </th>
                    <th className="min-w-[100px] px-4 py-4 font-medium text-blue dark:text-white">
                      Status
                    </th>
                    <th className="min-w-[200px] px-4 py-4 font-medium text-blue dark:text-white">
                      Reason
                    </th>
                    <th className="min-w-[110px] px-4 py-4 font-medium text-blue dark:text-white">
                      Created At
                    </th>
                    <th className="min-w-[280px] px-4 py-4 font-medium text-blue dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                        No KYC documents found
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((kyc) => (
                      <tr key={kyc.kyc_id} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                        <td className="px-4 py-5 text-sm font-medium text-blue dark:text-white">
                          #{kyc.kyc_id}
                        </td>
                        <td className="px-4 py-5">
                          <div className="text-sm font-medium text-blue dark:text-white">
                            {kyc.user_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">ID: {kyc.user_id}</div>
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-900 dark:text-gray-300">
                          {kyc.aadhaar_number || "N/A"}
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-900 dark:text-gray-300">
                          {kyc.pan_number || "N/A"}
                        </td>
                        <td className="px-4 py-5">
                          {getStatusBadge(kyc.is_verified)}
                        </td>
                        <td className="px-4 py-5">
                          {kyc.reason ? (
                            <div className="text-sm text-gray-900 dark:text-gray-300 max-w-xs">
                              <p className="whitespace-pre-line line-clamp-3" title={kyc.reason}>
                                {kyc.reason}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-5 text-sm text-gray-900 dark:text-gray-300">
                          {new Date(kyc.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-1.5 flex-wrap">
                              {kyc.aadhaar_front_url && (
                                <button
                                  onClick={() => viewDocument(kyc.aadhaar_front_url)}
                                  className="text-xs px-2.5 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                                  title="View Aadhaar Front"
                                >
                                  Aadhaar Front
                                </button>
                              )}
                              {kyc.aadhaar_back_url && (
                                <button
                                  onClick={() => viewDocument(kyc.aadhaar_back_url)}
                                  className="text-xs px-2.5 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                                  title="View Aadhaar Back"
                                >
                                  Aadhaar Back
                                </button>
                              )}
                              {kyc.pan_card_url && (
                                <button
                                  onClick={() => viewDocument(kyc.pan_card_url)}
                                  className="text-xs px-2.5 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                                  title="View PAN Card"
                                >
                                  PAN Card
                                </button>
                              )}
                            </div>
                            {kyc.is_verified === 0 && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => openActionModal(kyc, 1)}
                                  className="text-xs px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
                                  title="Approve KYC"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => openActionModal(kyc, 2)}
                                  className="text-xs px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                                  title="Reject KYC"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.length === 0 ? (
                <div className="col-span-full text-center text-sm text-gray-500 py-8">
                  No KYC documents found
                </div>
              ) : (
                filteredDocuments.map((kyc) => (
                  <div
                    key={kyc.kyc_id}
                    className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue dark:text-white">
                          #{kyc.kyc_id}
                        </div>
                        <div className="text-xs text-gray-500">{kyc.user_name}</div>
                      </div>
                      {getStatusBadge(kyc.is_verified)}
                    </div>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500">
                        <div><span className="font-medium">User ID:</span> {kyc.user_id}</div>
                        <div><span className="font-medium">Aadhaar:</span> {kyc.aadhaar_number || "N/A"}</div>
                        <div><span className="font-medium">PAN:</span> {kyc.pan_number || "N/A"}</div>
                      </div>
                    </div>
                    <div className="mb-3 text-xs">
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(kyc.created_at).toLocaleDateString()}
                      </div>
                      {kyc.reason && (
                        <div>
                          <span className="font-medium">Reason:</span> {kyc.reason}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {kyc.aadhaar_front_url && (
                        <button
                          onClick={() => viewDocument(kyc.aadhaar_front_url)}
                          className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Aadhaar Front
                        </button>
                      )}
                      {kyc.aadhaar_back_url && (
                        <button
                          onClick={() => viewDocument(kyc.aadhaar_back_url)}
                          className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Aadhaar Back
                        </button>
                      )}
                      {kyc.pan_card_url && (
                        <button
                          onClick={() => viewDocument(kyc.pan_card_url)}
                          className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          PAN Card
                        </button>
                      )}
                      {kyc.is_verified === 0 && (
                        <>
                          <button
                            onClick={() => openActionModal(kyc, 1)}
                            className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openActionModal(kyc, 2)}
                            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && selectedKyc && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-blue bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-blue dark:text-white">
              {actionStatus === 1 ? "Approve" : "Reject"} KYC Document
            </h3>
            <div className="mb-4">
              <div className="mb-2 text-sm">
                <span className="font-medium">User:</span> {selectedKyc.user_name}
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium">Aadhaar:</span> {selectedKyc.aadhaar_number || "N/A"}
              </div>
              <div className="mb-2 text-sm">
                <span className="font-medium">PAN:</span> {selectedKyc.pan_number || "N/A"}
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-blue dark:text-white">
                Reason {actionStatus === 2 && <span className="text-red-600">*</span>}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-strokedark"
                placeholder="Enter reason for approval/rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedKyc(null);
                  setRemarks("");
                }}
                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-blue hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(actionStatus)}
                className={`rounded px-4 py-2 text-sm font-medium text-white ${
                  actionStatus === 1 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
