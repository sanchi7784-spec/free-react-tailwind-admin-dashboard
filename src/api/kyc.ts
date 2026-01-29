import type { KycResponse } from "../types/kyc";

export async function fetchAllKycRecords(): Promise<KycResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `https://api.mastropaytech.com/dashboard/kyc-verification/${userId}`
    : `https://api.mastropaytech.com/dashboard/kyc-verification`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `KYC fetch failed: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }
  const data = (await res.json()) as KycResponse;
  return data;
}

export async function updateKycVerification(
  kyc_id: number,
  is_verified: 0 | 1 | 2,
  reason?: string | null
): Promise<any> {
  const base = (import.meta as any).env?.VITE_API_BASE ?? "https://api.mastropaytech.com";
  const adminId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  const url = adminId
    ? `${base.replace(/\/$/, "")}/dashboard/kyc-verification/${kyc_id}/${adminId}`
    : `${base.replace(/\/$/, "")}/dashboard/kyc-verification/${kyc_id}`;

  const body = { is_verified, reason };

  async function send(method: string, extraHeaders?: Record<string,string>) {
    const headers: Record<string,string> = { "Content-Type": "application/json", ...(extraHeaders || {}) };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    return res;
  }

  // Try PATCH first, fall back to PUT, then POST override
  let res = await send("PATCH");
  if (res.status === 405) {
    res = await send("PUT");
  }
  if (res.status === 405) {
    res = await send("POST", { "X-HTTP-Method-Override": "PATCH" });
  }

  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err?.detail || JSON.stringify(err) || `KYC update failed: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `KYC update failed: ${res.status}`);
    }
  }

  return res.json();
}

// Staff KYC Types
export type StaffKycStatus = -1 | 0 | 1 | 2;

export type StaffKycData = {
  staff_user_id: number;
  aadhaar_number: string;
  pan_number: string;
  status: StaffKycStatus;
  created_at?: string;
  updated_at?: string;
  rejection_reason?: string;
};

export type StaffKycResponse = {
  detail: string;
  data?: StaffKycData;
};

// Helper function to get status display text
export const getKycStatusText = (status: StaffKycStatus): string => {
  switch (status) {
    case -1: return "Not Uploaded";
    case 0: return "Pending";
    case 1: return "Approved";
    case 2: return "Rejected";
    default: return "Unknown";
  }
};

// Helper function to get status color
export const getKycStatusColor = (status: StaffKycStatus): string => {
  switch (status) {
    case -1: return "gray";
    case 0: return "yellow";
    case 1: return "green";
    case 2: return "red";
    default: return "gray";
  }
};

// Upload Staff KYC Documents (supports both initial upload and re-upload)
export async function uploadStaffKyc(
  staffUserId: string,
  aadhaarNumber: string,
  aadhaarFrontImage: File,
  aadhaarBackImage: File,
  panNumber: string,
  panImage: File,
  isReupload: boolean = false
): Promise<StaffKycResponse> {
  const base = (import.meta as any).env?.VITE_API_BASE ?? "https://api.mastropaytech.com";
  const url = `${base.replace(/\/$/, "")}/dashboard/staff-kyc`;

  const formData = new FormData();
  // Don't wrap values in quotes - send as plain strings
  formData.append("staff_user_id", staffUserId);
  formData.append("aadhaar_number", aadhaarNumber);
  formData.append("aadhaar_front_image", aadhaarFrontImage);
  formData.append("aadhaar_back_image", aadhaarBackImage);
  formData.append("pan_number", panNumber);
  formData.append("pan_image", panImage);

  // Use PATCH for re-upload (rejected KYC), POST for initial upload
  const method = isReupload ? "PATCH" : "POST";

  const res = await fetch(url, {
    method: method,
    body: formData,
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData?.detail || `Failed to upload staff KYC: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to upload staff KYC: ${res.status}`);
    }
  }

  const data = await res.json();
  return data as StaffKycResponse;
}

// Get Staff KYC Details
export async function fetchStaffKyc(staffUserId: string): Promise<StaffKycData> {
  const base = (import.meta as any).env?.VITE_API_BASE ?? "https://api.mastropaytech.com";
  const url = `${base.replace(/\/$/, "")}/dashboard/staff-kyc/${staffUserId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData?.detail || `Failed to fetch staff KYC: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to fetch staff KYC: ${res.status}`);
    }
  }

  const data = await res.json();
  return data as StaffKycData;
}
