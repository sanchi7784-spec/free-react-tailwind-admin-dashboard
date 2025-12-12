export interface Withdrawal {
  withdraw_id: string;
  user_name: string;
  user_email: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  amount: string;
  status: string;
}

export interface WithdrawalsResponse {
  detail: string;
  total_withdrawals: number;
  withdrawals: Withdrawal[];
}

/**
 * Fetch withdrawals from Mastropay API.
 * - baseUrl: override the API base (defaults to VITE_API_BASE or https://api.mastropaytech.com)
 * - apiKey: optional API key to send in Authorization header. If omitted, will try localStorage 'mp_api_key' or Vite env VITE_API_KEY.
 */
export async function fetchWithdrawals(options?: { baseUrl?: string; apiKey?: string }): Promise<WithdrawalsResponse> {
  const base = options?.baseUrl ?? (import.meta.env.VITE_API_BASE as string) ?? "https://api.mastropaytech.com";
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `${base.replace(/\/$/, "")}/dashboard/withdrawals/${userId}`
    : `${base.replace(/\/$/, "")}/dashboard/withdrawals`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const apiKey = options?.apiKey ?? (typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null) ?? (import.meta.env.VITE_API_KEY as string | undefined);
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch withdrawals: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = (await res.json()) as WithdrawalsResponse;
  return data;
}
