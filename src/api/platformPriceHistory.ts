export type PlatformPriceHistoryItem = {
  id: number;
  previous_platform_price: number;
  updated_platform_price: number | null;
  previous_sell_price: number;
  updated_sell_price: number | null;
  updated_by: string;
  created_at: string;
};

export type PlatformPriceHistoryResponse = {
  history: PlatformPriceHistoryItem[];
};

const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";

export async function fetchPlatformPriceHistory(): Promise<PlatformPriceHistoryResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  if (!userId) throw new Error("No user id found in localStorage (mp_user_id)");
  const url = `${BASE.replace(/\/$/, "")}/dashboard/platform-price/history/${userId}`;

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
    const message = errorData?.detail || text || `Failed to fetch platform price history: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as PlatformPriceHistoryResponse;
  return data;
}
