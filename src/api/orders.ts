// Use relative URL in development to work with Vite proxy, full URL in production
const BASE = import.meta.env.DEV ? "" : "https://api.mastrokart.com";

export interface OrderItemDetail {
  product_id: number;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  discount: number;
  total_price: number;
}

export interface Order {
  order_id: number;
  order_date: string;
  user_name: string;
  phone: string;
  email: string;
  address: string;
  total_amount: number;
  tax_amount: number;
  order_status: number;
  delivery_status: number;
  payment_method: number;
  payment_status: number;
  items: OrderItemDetail[];
}

export interface OrdersResponse {
  detail: string;
  data: Order[];
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  payment_method: number;
}

export interface CreateOrderResponse {
  detail: string;
  data?: any;
}

/**
 * Fetch all orders
 */
export async function fetchOrders(): Promise<OrdersResponse> {
  const token = localStorage.getItem("ecommerce_token");
  
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  
  const res = await fetch(`${BASE}/dashboard/orders`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "accept": "application/json"
    },
  });

  const text = await res.text();
  
  if (!res.ok) {
    // Try to parse error as JSON, otherwise use plain text
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      // If JSON parse fails, use the text directly
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

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const token = localStorage.getItem("ecommerce_token");
  
  if (!token) {
    throw new Error("No authentication token found. Please login first.");
  }
  
  const res = await fetch(`${BASE}/dashboard/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "accept": "application/json"
    },
    body: JSON.stringify(orderData),
  });

  const text = await res.text();
  
  if (!res.ok) {
    // Try to parse error as JSON, otherwise use plain text
    try {
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text || res.statusText;
      throw new Error(msg);
    } catch (parseError) {
      // If JSON parse fails, use the text directly
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
