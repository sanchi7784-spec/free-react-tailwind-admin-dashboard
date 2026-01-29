import { WalletTransactionsResponse } from "../types/wallet";

const BASE_URL = "https://api.mastropaytech.com";

export async function fetchWalletTransactions(): Promise<WalletTransactionsResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const url = userId
    ? `${BASE_URL}/dashboard/wallet-transactions/${userId}`
    : `${BASE_URL}/dashboard/wallet-transactions`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `Failed to fetch wallet transactions: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as WalletTransactionsResponse;
  return data;
}
