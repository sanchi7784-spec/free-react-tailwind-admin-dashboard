const BASE = import.meta.env.DEV ? "" : "https://api.mastrokart.com";

export interface SettingsResponse {
  detail: string;
  data: any;
}

export interface UpdateSettingsPayload {
  company_name: string;
  company_email: string;
  company_phone: string;
  business_model: string;
  time_zone: string;
  payment_method_id: number;
  status: number;
}

export async function fetchSettings(): Promise<SettingsResponse> {
  const token = localStorage.getItem("ecommerce_token");
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  const res = await fetch(`${BASE}/dashboard/settings`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "application/json"
    },
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }
  try {
    const json = JSON.parse(text);
    return json;
  } catch (parseError) {
    throw new Error("Invalid response format from server");
  }
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<{ detail: string }> {
  const token = localStorage.getItem("ecommerce_token");
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  const res = await fetch(`${BASE}/dashboard/settings/update`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }
  try {
    const json = JSON.parse(text);
    return json;
  } catch (parseError) {
    throw new Error("Invalid response format from server");
  }
}

export interface CommissionData {
  commission_status: number;
  commission_value: number;
  commission_type: number;
  commission_charge: number;
  shop_registration_status: number;
}

export async function fetchCommission(): Promise<{ detail: string; data: CommissionData }> {
  const token = localStorage.getItem("ecommerce_token");
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  const res = await fetch(`${BASE}/dashboard/commission`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "application/json"
    },
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }
  try {
    const json = JSON.parse(text);
    return json;
  } catch (parseError) {
    throw new Error("Invalid response format from server");
  }
}

export async function updateCommission(payload: CommissionData): Promise<{ detail: string }> {
  const token = localStorage.getItem("ecommerce_token");
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  const res = await fetch(`${BASE}/dashboard/commission/update`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }
  try {
    const json = JSON.parse(text);
    return json;
  } catch (parseError) {
    throw new Error("Invalid response format from server");
  }
}
