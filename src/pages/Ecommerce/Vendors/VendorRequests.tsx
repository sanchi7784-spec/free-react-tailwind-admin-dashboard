import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { getEcommerceToken, getEcommerceAuthDetails } from "../../../utils/ecommerceAuth";

// Direct API URL - no proxy
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
  const [showReupload, setShowReupload] = useState(false);
  const [reuploadLoading, setReuploadLoading] = useState(false);
  const [reuploadMessage, setReuploadMessage] = useState<string | null>(null);
  const [reuploadMessageType, setReuploadMessageType] = useState<"success" | "error" | null>(null);
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

    // Validate all required fields
    if (!aadhaarFront || !aadhaarBack || !panCard) {
      setMessage("Please select all required documents.");
      setMessageType("error");
      return;
    }

    if (!aadhaarNumber || !panNumber) {
      setMessage("Please enter both Aadhaar and PAN numbers.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      // Get token from localStorage (dynamic - NO HARDCODED VALUES)
      const tokenValue = localStorage.getItem("ecommerce_token");
      
      if (!tokenValue) {
        throw new Error("Authorization token not found. Please login again.");
      }

      // Check if this is an update or new submission
      const isUpdate = !!(kycRecord && kycRecord.kyc_id);
      const method = isUpdate ? "PATCH" : "POST";
      const url = isUpdate 
        ? `${ECOMMERCE_API_BASE_URL}/staff/kyc/update` 
        : `${ECOMMERCE_API_BASE_URL}/staff/kyc/submit`;

      console.log("=== KYC SUBMISSION DEBUG ===");
      console.log("Existing KYC Record:", kycRecord);
      console.log("Is Update?:", isUpdate);
      console.log(`Using ${method} to ${url}`);
      console.log("Token (first 20 chars):", tokenValue.substring(0, 20) + "...");
      console.log("===========================");

      // Prepare FormData
      const formdata = new FormData();
      formdata.append("aadhaar_front", aadhaarFront);
      formdata.append("aadhaar_back", aadhaarBack);
      formdata.append("pan_card", panCard);
      formdata.append("aadhaar_number", aadhaarNumber);
      formdata.append("pan_number", panNumber);

      console.log("FormData prepared with:", {
        aadhaar_front: aadhaarFront.name,
        aadhaar_back: aadhaarBack.name,
        pan_card: panCard.name,
        aadhaar_number: aadhaarNumber,
        pan_number: panNumber,
      });

      // Prepare headers - only Authorization token required
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${tokenValue}`);

      const requestOptions: RequestInit = {
        method: method,
        headers: myHeaders,
        body: formdata,
      };

      // Make API call
      const response = await fetch(url, requestOptions);

      console.log("Response status:", response.status);

      if (!response.ok) {
        // Clone response so we can read it multiple times if needed
        const clonedResponse = response.clone();
        let errorMessage = `Server error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error("Server error response (JSON):", errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          try {
            const errorText = await clonedResponse.text();
            console.error("Server error response (Text):", errorText);
            if (errorText) errorMessage = errorText;
          } catch {
            console.error("Could not parse error response");
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("KYC Submission Result:", result);

      setMessage(result.detail || "KYC submitted successfully");
      setMessageType("success");

      // Reset form
      setAadhaarFront(null);
      setAadhaarBack(null);
      setPanCard(null);
      setAadhaarNumber("");
      setPanNumber("");

      // Refetch KYC status
      try { await fetchKyc(); } catch { /* ignore */ }
    } catch (error: any) {
      console.error("KYC Submission Error:", error);
      setMessage(error.message || "KYC submission failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Force PATCH reupload handler (shown when KYC status is 1 or 2)
  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReuploadMessage(null);

    if (!aadhaarFront && !aadhaarBack && !panCard && !aadhaarNumber && !panNumber) {
      setReuploadMessage("Please upload at least one document or fill a number to update.");
      setReuploadMessageType("error");
      return;
    }

    const formData = new FormData();
    if (aadhaarFront) formData.append("aadhaar_front", aadhaarFront, aadhaarFront.name);
    if (aadhaarBack) formData.append("aadhaar_back", aadhaarBack, aadhaarBack.name);
    if (panCard) formData.append("pan_card", panCard, panCard.name);
    if (aadhaarNumber) formData.append("aadhaar_number", aadhaarNumber);
    if (panNumber) formData.append("pan_number", panNumber);

    try {
      setReuploadLoading(true);
      const { token, userId } = getEcommerceAuthDetails();
      const tokenValue = token || getEcommerceToken();
      const staffUserId = userId || localStorage.getItem("ecommerce_user_id");

      const headers: Record<string, string> = {};
      if (tokenValue) headers["Authorization"] = `Bearer ${tokenValue}`;
      if (staffUserId) headers["staff_user_id"] = String(staffUserId);

      const resp = await fetch(`${ECOMMERCE_API_BASE_URL}/staff/kyc/update`, {
        method: "PATCH",
        headers: Object.keys(headers).length ? headers : undefined,
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Reupload failed");
      }

      setReuploadMessage("Documents re-uploaded successfully.");
      setReuploadMessageType("success");
      setShowReupload(false);
      // refetch KYC status
      try { await fetchKyc(); } catch { /* ignore */ }
    } catch (error: any) {
      setReuploadMessage(error.message || "Reupload failed");
      setReuploadMessageType("error");
    } finally {
      setReuploadLoading(false);
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

  const kycStatusNum = Number(kycRecord?.is_verified ?? 0);

  return (
    <>
      <PageMeta title="Vendor|Staff KYC Upload - Ecommerce" description="Upload KYC documents" />
      <PageBreadCrumb pageTitle="Vendor|Staff KYC Upload" />

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
        {/* Re-upload panel shown only when KYC status is 1 or 2 */}
        {kycRecord && (kycStatusNum === 1 || kycStatusNum === 2) && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm dark:border-strokedark dark:from-boxdark dark:to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Re-upload Documents</h3>
                <p className="text-sm text-slate-500 mt-1">Status: <span className="font-medium text-slate-700">{KYC_STATUS_MAP[String(kycStatusNum)].toUpperCase()}</span>. Re-upload files to update your KYC.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReupload((s) => !s)}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
                >
                  {showReupload ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Hide
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0-8V4m0 0l-3 3m3-3 3 3" /></svg>
                      Re-upload
                    </>
                  )}
                </button>
              </div>
            </div>

            {reuploadMessage && (
              <div className={`mt-4 text-sm font-medium ${reuploadMessageType === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{reuploadMessage}</div>
            )}

            {showReupload && (
              <form onSubmit={handleReuploadSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Aadhaar Front */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-2">Aadhaar Front</label>
                    <label className="group relative flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-3 transition hover:border-indigo-300 dark:bg-transparent">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAadhaarFront(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center text-center">
                        {aadhaarFrontPreview ? (
                          <div className="h-20 w-28 overflow-hidden rounded-lg shadow-sm">
                            <img src={aadhaarFrontPreview} alt="aadhaar front" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m10 12V4M3 20h18" /></svg>
                        )}
                        <div className="mt-2 text-xs text-slate-500 group-hover:text-indigo-600">Click or drop to upload</div>
                        {aadhaarFront && <div className="mt-2 text-xs text-slate-600 max-w-[9rem] truncate">{aadhaarFront.name}</div>}
                      </div>
                    </label>
                    {aadhaarFront && (
                      <button type="button" onClick={() => setAadhaarFront(null)} className="mt-2 text-xs text-rose-600">Remove</button>
                    )}
                  </div>

                  {/* Aadhaar Back */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-2">Aadhaar Back</label>
                    <label className="group relative flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-3 transition hover:border-indigo-300 dark:bg-transparent">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setAadhaarBack(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center text-center">
                        {aadhaarBackPreview ? (
                          <div className="h-20 w-28 overflow-hidden rounded-lg shadow-sm">
                            <img src={aadhaarBackPreview} alt="aadhaar back" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m10 12V4M3 20h18" /></svg>
                        )}
                        <div className="mt-2 text-xs text-slate-500 group-hover:text-indigo-600">Click or drop to upload</div>
                        {aadhaarBack && <div className="mt-2 text-xs text-slate-600 max-w-[9rem] truncate">{aadhaarBack.name}</div>}
                      </div>
                    </label>
                    {aadhaarBack && (
                      <button type="button" onClick={() => setAadhaarBack(null)} className="mt-2 text-xs text-rose-600">Remove</button>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-600 mb-2">PAN Card</label>
                    <label className="group relative flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-3 transition hover:border-indigo-300 dark:bg-transparent">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center text-center">
                        {panCardPreview ? (
                          <div className="h-20 w-28 overflow-hidden rounded-lg shadow-sm">
                            <img src={panCardPreview} alt="pan card" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m10 12V4M3 20h18" /></svg>
                        )}
                        <div className="mt-2 text-xs text-slate-500 group-hover:text-indigo-600">Click or drop to upload</div>
                        {panCard && <div className="mt-2 text-xs text-slate-600 max-w-[9rem] truncate">{panCard.name}</div>}
                      </div>
                    </label>
                    {panCard && (
                      <button type="button" onClick={() => setPanCard(null)} className="mt-2 text-xs text-rose-600">Remove</button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="text" placeholder="Aadhaar number" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                  <input type="text" placeholder="PAN number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>

                <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={reuploadLoading} className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 disabled:opacity-60">
                      {reuploadLoading ? (
                        'Re-uploading...'
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" /></svg>
                          Re-upload Documents
                        </>
                      )}
                    </button>
                    <button type="button" onClick={() => { setAadhaarFront(null); setAadhaarBack(null); setPanCard(null); setAadhaarNumber(''); setPanNumber(''); setReuploadMessage(null); setReuploadMessageType(null); }} className="text-sm text-slate-600 hover:text-slate-800">Reset</button>
                  </div>

                  <div className="text-xs text-slate-400">Accepted: PNG, JPG, PDF — max 5MB each</div>
                </div>
              </form>
            )}
          </div>
        )}

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
