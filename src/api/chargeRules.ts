export type ChargeRule = {
  id: number;
  slug: number;
  min_amount: string;
  max_amount: string;
  fixed_charge: string;
  percent_charge: string;
  vat_percent: string;
  status: number;
};

export type ChargeRulesResponse = {
  detail: string;
  total_rules: number;
  charge_rules: ChargeRule[];
};

const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";

export async function fetchChargeRules(): Promise<ChargeRulesResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const url = userId ? `${BASE.replace(/\/$/, "")}/dashboard/charge-rules/${userId}` : `${BASE.replace(/\/$/, "")}/dashboard/charge-rules`;

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
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `Failed to fetch charge rules: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as ChargeRulesResponse;
  return data;
}

export type CreateChargeRulePayload = {
  slug: number;
  min_amount: number;
  max_amount: number;
  fixed_charge: number;
  percent_charge: number;
  vat_percent: number;
};

export type CreateChargeRuleResponse = {
  detail: string;
  id: number;
};

export async function createChargeRule(payload: CreateChargeRulePayload): Promise<CreateChargeRuleResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const url = userId ? `${BASE.replace(/\/$/, "")}/dashboard/charge-rules/${userId}` : `${BASE.replace(/\/$/, "")}/dashboard/charge-rules`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `Failed to create charge rule: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as CreateChargeRuleResponse;
  return data;
}

export type UpdateChargeRulePayload = {
  slug?: number;
  min_amount?: number;
  max_amount?: number;
  fixed_charge?: number;
  percent_charge?: number;
  vat_percent?: number;
  status?: number;
};

export type UpdateChargeRuleResponse = {
  detail: string;
};

export async function updateChargeRule(ruleId: number, payload: UpdateChargeRulePayload): Promise<UpdateChargeRuleResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const url = userId ? `${BASE.replace(/\/$/, "")}/dashboard/charge-rules/${ruleId}/${userId}` : `${BASE.replace(/\/$/, "")}/dashboard/charge-rules/${ruleId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `Failed to update charge rule: ${res.status}`;
    const err = new Error(message);
    (err as any).detail = errorData?.detail || text;
    throw err;
  }

  const data = (await res.json()) as UpdateChargeRuleResponse;
  return data;
}
