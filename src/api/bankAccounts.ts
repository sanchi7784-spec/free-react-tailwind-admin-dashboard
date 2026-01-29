export interface BankAccount {
  bank_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  passbook_photo: string | null;
  // API sometimes returns human readable status (string) for GET,
  // and numeric code for PATCH responses. Allow both.
  is_verified: string | number;
  reason: string | null;
}

export interface BankAccountsResponse {
  detail: string;
  total_records: number;
  bank_accounts: BankAccount[];
}

export async function fetchBankAccounts(options?: { baseUrl?: string; apiKey?: string }): Promise<BankAccountsResponse> {
  const base = options?.baseUrl ?? (import.meta.env.VITE_API_BASE as string) ?? "https://api.mastropaytech.com";
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `${base.replace(/\/$/, "")}/dashboard/bank-accounts/${userId}`
    : `${base.replace(/\/$/, "")}/dashboard/bank-accounts`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const apiKey = options?.apiKey ?? (typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null) ?? (import.meta.env.VITE_API_KEY as string | undefined);
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    // Try to parse JSON error body and attach it to the thrown error as `.detail`
    const text = await res.text().catch(() => "");
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = null; }
    const message = parsed?.detail
      ? (typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail))
      : parsed?.errors ? JSON.stringify(parsed.errors) : (text || `${res.status} ${res.statusText}`);
    const err = new Error(message);
    (err as any).detail = parsed ?? text;
    throw err;
  }
  const data = (await res.json()) as BankAccountsResponse;
  return data;
}

export interface PatchBankAccountResponse {
  detail: string;
  bank_id: number | string;
  user_id: number | string;
  is_verified: number | string;
  reason: string | null;
}


export async function patchBankAccountVerification(bankId: string | number, body: { is_verified: number; reason?: string }, options?: { baseUrl?: string; apiKey?: string }): Promise<PatchBankAccountResponse> {
  const base = options?.baseUrl ?? (import.meta.env.VITE_API_BASE as string) ?? "https://api.mastropaytech.com";
  const adminId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = adminId
    ? `${base.replace(/\/$/, "")}/dashboard/bank-accounts/${bankId}/${adminId}`
    : `${base.replace(/\/$/, "")}/dashboard/bank-accounts/${bankId}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const apiKey = options?.apiKey ?? (typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null) ?? (import.meta.env.VITE_API_KEY as string | undefined);
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  async function send(method: string, extraHeaders?: Record<string,string>) {
    const h = { ...headers, ...(extraHeaders || {}) };
    return fetch(url, { method, headers: h, body: JSON.stringify(body) });
  }


  let res = await send("PATCH");
  if (res.status === 405) {
    res = await send("PUT");
  }
  if (res.status === 405) {
    res = await send("POST", { "X-HTTP-Method-Override": "PATCH" });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = null; }
    const message = parsed?.detail
      ? (typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail))
      : parsed?.errors ? JSON.stringify(parsed.errors) : (text || `${res.status} ${res.statusText}`);
    const err = new Error(message);
    (err as any).detail = parsed ?? text;
    throw err;
  }
  const data = (await res.json()) as PatchBankAccountResponse;
  return data;
}
