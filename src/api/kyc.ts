import type { KycResponse } from "../types/kyc";

export async function fetchAllKycRecords(): Promise<KycResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `https://api.mastropaytech.com/dashboard/kyc-verification/${userId}`
    : `https://api.mastropaytech.com/dashboard/kyc-verification`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `KYC fetch failed: ${res.status}`);
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
