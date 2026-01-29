export type ChargeChangeHistoryItem = {
  id: number;
  charge_rule_id: number;
  charge_rule_slug: string;
  previous_min_amount: number;
  updated_min_amount: number;
  previous_max_amount: number;
  updated_max_amount: number;
  previous_fixed_charge: number;
  updated_fixed_charge: number;
  previous_percent_charge: number;
  updated_percent_charge: number;
  previous_vat_percent: number;
  updated_vat_percent: number;
  previous_status: number;
  updated_status: number;
  updated_by: string;
  created_at: string;
};

export type ChargeChangeHistoryResponse = {
  history: ChargeChangeHistoryItem[];
};

const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";

export async function fetchChargeChangeHistory(): Promise<ChargeChangeHistoryResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  if (!userId) throw new Error("No user id found in localStorage (mp_user_id)");
  const url = `${BASE.replace(/\/$/, "")}/dashboard/charge-rules/history/${userId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {}
    const message = errorData?.detail || text || `Failed to fetch charge change history: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as ChargeChangeHistoryResponse;
  return data;
}
