export interface Portfolio {
  user_id: string;
  user_name: string;
  user_email: string;
  invested_amount: string;
  returns_currency: string;
  returns_percentage: string;
  return_flag: string;
  total_gold_grams: string;
  current_value: string;
}

export interface PortfolioResponse {
  detail: string;
  total_users: number;
  portfolios: Portfolio[];
}

/**
 * Fetch all users portfolio from Mastropay API.
 * - baseUrl: override the API base (defaults to VITE_API_BASE or https://api.mastropaytech.com)
 * - apiKey: optional API key to send in Authorization header. If omitted, will try localStorage 'mp_api_key' or Vite env VITE_API_KEY.
 * - livePrice: the current live gold price (required for POST body)
 */
export async function fetchPortfolio(options: { livePrice: number; baseUrl?: string; apiKey?: string }): Promise<PortfolioResponse> {
  const base = options?.baseUrl ?? (import.meta.env.VITE_API_BASE as string) ?? "https://api.mastropaytech.com";
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `${base.replace(/\/$/, "")}/dashboard/portfolio/${userId}`
    : `${base.replace(/\/$/, "")}/dashboard/portfolio`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const apiKey = options?.apiKey ?? (typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null) ?? (import.meta.env.VITE_API_KEY as string | undefined);
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, { 
    method: "POST", 
    headers,
    body: JSON.stringify({ live_price: options.livePrice })
  });
  
  if (!res.ok) {
    // Try to parse structured JSON error first, otherwise fallback to text
    try {
      const errorData = await res.json();
      const errorMessage = errorData && errorData.detail
        ? (typeof errorData.detail === 'string'
            ? errorData.detail
            : Array.isArray(errorData.detail)
              ? errorData.detail.map((e: any) => e.msg || e).join(', ')
              : JSON.stringify(errorData.detail))
        : `${res.status} ${res.statusText}`;
      throw new Error(errorMessage);
    } catch (parseErr) {
      // JSON parse failed or unexpected shape — fall back to plain text
      const text = await res.text();
      throw new Error(`Failed to fetch portfolio: ${res.status} - ${text}`);
    }
  }
  const data = (await res.json()) as PortfolioResponse;
  return data;
}
