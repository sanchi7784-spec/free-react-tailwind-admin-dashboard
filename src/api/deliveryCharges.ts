export type DeliveryCharge = {
  id?: number;
  delivery_charge_id?: number;
  min_order_quantity: number;
  max_order_quantity: number;
  charge_amount: number;
  status: number;
};

export type DeliveryChargesResponse = {
  detail: string;
  data: DeliveryCharge[];
};

export type CreateDeliveryChargePayload = {
  min_order_quantity: number;
  max_order_quantity: number;
  charge_amount: number;
};

export type UpdateDeliveryChargePayload = {
  min_order_quantity: number;
  max_order_quantity: number;
  charge_amount: number;
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

export async function fetchDeliveryCharges(): Promise<DeliveryChargesResponse> {
  const res = await fetch(`${BASE}/dashboard/delivery-charges`, {
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
    let message = `Failed to fetch delivery charges: ${res.status}`;
    if (errorData) {
      if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      } else if (typeof errorData.detail === 'object') {
        // Handle validation errors or structured error objects
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

  const data = (await res.json()) as DeliveryChargesResponse;
  
  // Normalize ID field: convert delivery_charge_id to id if needed
  if (data.data) {
    data.data = data.data.map(charge => ({
      ...charge,
      id: charge.id ?? charge.delivery_charge_id
    }));
  }
  
  return data;
}

export async function createDeliveryCharge(
  payload: CreateDeliveryChargePayload
): Promise<{ detail: string }> {
  const res = await fetch(`${BASE}/dashboard/delivery-charges/create`, {
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
    let message = `Failed to create delivery charge: ${res.status}`;
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

export async function updateDeliveryCharge(
  id: number,
  payload: UpdateDeliveryChargePayload
): Promise<{ detail: string }> {
  const res = await fetch(`${BASE}/dashboard/delivery-charges/update/${id}`, {
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
    let message = `Failed to update delivery charge: ${res.status}`;
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
