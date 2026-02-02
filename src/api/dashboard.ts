import { getUserId } from '../utils/auth';

const BASE = "https://api.mastropaytech.com";

export interface DashboardOverviewData {
  total_users: number;
  total_amount_invested: string;
  total_purchased_gold: string;
  total_selled_gold: string;
  total_withdrawals: number;
  pending_withdrawals: number;
  successful_withdrawals: number;
  failed_withdrawals: number;
  total_kyc: number;
  approved_kyc: number;
  rejected_kyc: number;
  pending_kyc: number;
}

export interface DashboardOverviewResponse {
  detail: string;
  data: DashboardOverviewData;
}

export interface AppVersionData {
  detail: string;
  app_version: string;
  updated_at: string;
}

export interface UpdateAppVersionRequest {
  app_version: string;
}

export interface UpdateAppVersionResponse {
  detail: string;
  app_version: string;
  updated_at: string;
}

export async function getAppVersion(): Promise<AppVersionData> {
  // Get user ID using auth helper
  const userId = getUserId();
  
  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const res = await fetch(`${BASE}/dashboard/app-version/${userId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json", 
      "accept": "application/json" 
    },
  });

  const text = await res.text();
  
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (parseError) {
    // If parsing fails and response is not ok, throw error with raw text
    if (!res.ok) {
      const err = new Error(text || res.statusText);
      (err as any).detail = text || res.statusText;
      throw err;
    }
    // If parsing fails but response is ok, throw parse error
    throw parseError;
  }
  
  // If response is not ok, throw error with detail from JSON
  if (!res.ok) {
    const msg = json?.detail || text || res.statusText;
    const err = new Error(msg);
    (err as any).detail = json?.detail || msg;
    throw err;
  }
  
  return json;
}

export async function updateAppVersion(version: string): Promise<UpdateAppVersionResponse> {
  // Get user ID using auth helper
  const userId = getUserId();
  
  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const res = await fetch(`${BASE}/dashboard/app-version/${userId}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json", 
      "accept": "application/json" 
    },
    body: JSON.stringify({ app_version: version }),
  });

  const text = await res.text();
  
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (parseError) {
    // If parsing fails and response is not ok, throw error with raw text
    if (!res.ok) {
      const err = new Error(text || res.statusText);
      (err as any).detail = text || res.statusText;
      throw err;
    }
    // If parsing fails but response is ok, throw parse error
    throw parseError;
  }
  
  // If response is not ok, throw error with detail from JSON
  if (!res.ok) {
    const msg = json?.detail || text || res.statusText;
    const err = new Error(msg);
    (err as any).detail = json?.detail || msg;
    throw err;
  }
  
  return json;
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  // Get user ID using auth helper
  const userId = getUserId();
  
  if (!userId) {
    throw new Error("User ID not found. Please login again.");
  }

  const res = await fetch(`${BASE}/dashboard/overview/${userId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json", 
      "accept": "application/json" 
    },
  });

  const text = await res.text();
  
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      const msg = json?.detail || text || res.statusText;
      const err = new Error(msg);
      (err as any).detail = json?.detail || text;
      throw err;
    }
    return json;
  } catch (e: any) {
    if (!res.ok) {
      const err = new Error(text || res.statusText);
      (err as any).detail = text;
      throw err;
    }
    throw e;
  }
}

// Ecommerce Dashboard Overview
export interface EcommerceDashboardOverview {
  total_users: number;
  total_vendors: number;
  total_products: number;
  total_orders: number;
  total_sell: number;
  total_revenue: number;
}

export interface EcommerceDashboardOverviewResponse {
  detail: string;
  data: EcommerceDashboardOverview;
}

const ECOMMERCE_BASE = "https://api.mastrokart.com";

function getEcommerceAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchEcommerceDashboardOverview(): Promise<EcommerceDashboardOverviewResponse> {
  const res = await fetch(`${ECOMMERCE_BASE}/dashboard/overview`, {
    method: "GET",
    headers: getEcommerceAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    
    // Handle different error formats
    let message = `Failed to fetch dashboard overview: ${res.status}`;
    if (errorData) {
      if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      } else if (typeof errorData.detail === 'object') {
        message = JSON.stringify(errorData.detail);
      } else if (errorData.message) {
        message = errorData.message;
      } else if (text) {
        message = text;
      }
    } else if (text) {
      message = text;
    }
    
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    (err as any).status = res.status;
    throw err;
  }

  const data = (await res.json()) as EcommerceDashboardOverviewResponse;
  // console.log('Fetched ecommerce dashboard overview:', data);
  return data;
}
