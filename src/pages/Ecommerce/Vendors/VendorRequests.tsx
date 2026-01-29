import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { getEcommerceToken, getEcommerceAuthDetails } from "../../../utils/ecommerceAuth";

const ECOMMERCE_API_BASE_URL = "https://api.mastrokart.com/dashboard";

export default function VendorRequests() {
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState<string | null>(null);
  const [aadhaarBackPreview, setAadhaarBackPreview] = useState<string | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [kycRecord, setKycRecord] = useState<any | null>(null);

  const KYC_STATUS_MAP: Record<string, string> = {
    "0": "pending",
    "1": "approved",
    "2": "rejected",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!aadhaarFront || !aadhaarBack || !panCard) {
      setMessage("Please select all required documents.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    if (aadhaarFront) formData.append("aadhaar_front", aadhaarFront, aadhaarFront.name);
    if (aadhaarBack) formData.append("aadhaar_back", aadhaarBack, aadhaarBack.name);
    if (panCard) formData.append("pan_card", panCard, panCard.name);
    if (aadhaarNumber) formData.append("aadhaar_number", aadhaarNumber);
    if (panNumber) formData.append("pan_number", panNumber);

    // if no fields selected, prevent empty submit
    if (!aadhaarFront && !aadhaarBack && !panCard && !aadhaarNumber && !panNumber) {
      setMessage("Please upload at least one document or fill a number to update.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const { token, userId } = getEcommerceAuthDetails();
      const tokenValue = token || getEcommerceToken();
      const staffUserId = userId || localStorage.getItem("ecommerce_user_id");

      const isUpdate = !!(kycRecord && kycRecord.kyc_id);
      const url = isUpdate ? `${ECOMMERCE_API_BASE_URL}/staff/kyc/update` : `${ECOMMERCE_API_BASE_URL}/staff/kyc/submit`;
      const method = isUpdate ? "PATCH" : "POST";

      const headers: Record<string, string> = {};
      if (tokenValue) headers["Authorization"] = `Bearer ${tokenValue}`;
      if (staffUserId) headers["staff_user_id"] = String(staffUserId);

      const resp = await fetch(url, {
        method,
        headers: Object.keys(headers).length ? headers : undefined,
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      setMessage(isUpdate ? "KYC documents updated successfully." : "KYC documents uploaded successfully.");
      setMessageType("success");
      // reset form
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPanCard(null);
      setAadhaarNumber("");
      setPanNumber("");

      // refetch KYC status
      if (typeof fetchKyc === "function") {
        try { await fetchKyc(); } catch { /* ignore */ }
      }
    } catch (error: any) {
      setMessage(error.message || "Upload failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aadhaarFront) {
      const url = URL.createObjectURL(aadhaarFront);
      setAadhaarFrontPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAadhaarFrontPreview(null);
    }
  }, [aadhaarFront]);

  useEffect(() => {
    if (aadhaarBack) {
      const url = URL.createObjectURL(aadhaarBack);
      setAadhaarBackPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAadhaarBackPreview(null);
    }
  }, [aadhaarBack]);

  useEffect(() => {
    if (panCard) {
      const url = URL.createObjectURL(panCard);
      setPanCardPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPanCardPreview(null);
    }
  }, [panCard]);

  // Fetch current user's KYC status (callable)
  async function fetchKyc() {
    setKycLoading(true);
    setKycError(null);
    try {
      const { token, userId } = getEcommerceAuthDetails();
      const tokenValue = token || getEcommerceToken();
      const staffUserId = userId || localStorage.getItem("ecommerce_user_id");

      if (!staffUserId) {
        setKycError("User ID not found in localStorage");
        return;
      }

      const resp = await fetch(`${ECOMMERCE_API_BASE_URL}/staff/kyc?staff_user_id=${staffUserId}`, {
        method: "GET",
        headers: tokenValue ? { Authorization: `Bearer ${tokenValue}` } : undefined,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to fetch KYC status");
      }

      const result = await resp.json();
      // API may return data as array or object
      const kyc = Array.isArray(result.data) ? result.data[0] : result.data || result;
      setKycRecord(kyc || null);
    } catch (err: any) {
      setKycError(err.message || "Failed to load KYC status");
    } finally {
      setKycLoading(false);
    }
  }

  // call on mount
  useEffect(() => { fetchKyc(); }, []);

  return (
    <>
      <PageMeta title="Vendor Requests - Ecommerce" description="Upload KYC documents" />
      <PageBreadCrumb pageTitle="Vendor Requests" />

      <div className="max-w-3xl mx-auto rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-lg dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Upload Your KYC Documents</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Submit original documents. You can see your KYC status later.</p>
          </div>
          <div className="text-sm text-red-400">Required: Aadhaar (front/back) & PAN</div>
        </div>

        {/* KYC status display */}
        <div className="mt-4">
          {kycLoading ? (
            <div className="text-sm text-slate-500">Checking KYC status...</div>
          ) : kycError ? (
            <div className="text-sm text-rose-600">{kycError}</div>
          ) : kycRecord ? (
            (() => {
              const key = String(kycRecord.is_verified ?? kycRecord.is_verified ?? "0");
              const label = KYC_STATUS_MAP[key] ?? "pending";
              const colorClass = label === "approved" ? "bg-emerald-100 text-emerald-700" : label === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
              return (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}>{label.toUpperCase()}</span>
                  {kycRecord.reason && <div className="text-sm text-slate-500">Reason: {kycRecord.reason}</div>}
                  {(kycRecord.updated_at || kycRecord.created_at) && (
                    <div className="text-sm text-slate-400">Updated: {kycRecord.updated_at || kycRecord.created_at}</div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-slate-500">No KYC submitted yet.</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Aadhaar Front */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Aadhaar Front</label>
              <label className="relative flex h-36 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center hover:border-slate-400 cursor-pointer dark:bg-transparent">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setAadhaarFront(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-700">Click to upload</div>
                  <div className="text-xs text-slate-500">PNG, JPG or PDF</div>
                </div>
              </label>
              {aadhaarFrontPreview && (
                <img src={aadhaarFrontPreview} alt="aadhaar front" className="mt-2 h-20 w-auto rounded object-cover" />
              )}
            </div>

            {/* Aadhaar Back */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Aadhaar Back</label>
              <label className="relative flex h-36 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center hover:border-slate-400 cursor-pointer dark:bg-transparent">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setAadhaarBack(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-700">Click to upload</div>
                  <div className="text-xs text-slate-500">PNG, JPG or PDF</div>
                </div>
              </label>
              {aadhaarBackPreview && (
                <img src={aadhaarBackPreview} alt="aadhaar back" className="mt-2 h-20 w-auto rounded object-cover" />
              )}
            </div>

            {/* PAN Card */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">PAN Card</label>
              <label className="relative flex h-36 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center hover:border-slate-400 cursor-pointer dark:bg-transparent">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-700">Click to upload</div>
                  <div className="text-xs text-slate-500">PNG, JPG or PDF</div>
                </div>
              </label>
              {panCardPreview && (
                <img src={panCardPreview} alt="pan card" className="mt-2 h-20 w-auto rounded object-cover" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter Aadhaar number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter PAN number"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Submit Documents"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAadhaarFront(null);
                  setAadhaarBack(null);
                  setPanCard(null);
                  setAadhaarNumber("");
                  setPanNumber("");
                  setMessage(null);
                  setMessageType(null);
                }}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Reset
              </button>
            </div>

            {message && (
              <div className={
                `text-sm font-medium ${messageType === 'success' ? 'text-emerald-600' : 'text-rose-600'}`
              }>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
