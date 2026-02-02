export type Tax = {
  id?: number;
  tax_id?: number;
  tax_name: string;
  percentage: number;
  status: number;
};

export type TaxesResponse = {
  detail: string;
  data: Tax[];
};

export type CreateTaxPayload = {
  tax_name: string;
  percentage: number;
};

export type UpdateTaxPayload = {
  tax_name: string;
  percentage: number;
  status: number;
};

const BASE = "https://api.mastrokart.com";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchTaxes(): Promise<TaxesResponse> {
  const res = await fetch(`${BASE}/dashboard/taxes`, {
    method: "GET",
    headers: getAuthHeaders(),
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
    let message = `Failed to fetch taxes: ${res.status}`;
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

  const data = (await res.json()) as TaxesResponse;
  
  // Normalize ID field: convert tax_id to id if needed
  if (data.data) {
    data.data = data.data.map(tax => ({
      ...tax,
      id: tax.id ?? tax.tax_id
    }));
  }
  
  // console.log('Fetched taxes:', data);
  return data;
}

export async function createTax(
  payload: CreateTaxPayload
): Promise<{ detail: string }> {
  const res = await fetch(`${BASE}/dashboard/taxes/create`, {
    method: "POST",
    headers: getAuthHeaders(),
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
    
    // Handle different error formats
    let message = `Failed to create tax: ${res.status}`;
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

  const data = await res.json();
  return data;
}

export async function updateTax(
  id: number,
  payload: UpdateTaxPayload
): Promise<{ detail: string }> {
  const res = await fetch(`${BASE}/dashboard/taxes/update/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
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
    
    // Handle different error formats
    let message = `Failed to update tax: ${res.status}`;
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

  const data = await res.json();
  return data;
}
