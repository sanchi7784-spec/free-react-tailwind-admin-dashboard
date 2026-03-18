const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

export interface PaymentItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
  options: Record<string, string>;
}

export interface PaymentUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface PaymentDetails {
  merchant_order_id: string;
  gateway_payment_id: string | null;
  gateway: string;
  payment_method_id: number;
  amount: number;
  currency: string;
  payment_status: number;
  created_at: string;
}

export interface OrderDetails {
  order_id: number;
  subtotal: number;
  tax_amount: number;
  delivery_charge: number;
  total_amount: number;
  order_status: number;
  payment_method: number;
  payment_status: number;
  tracking_number: string | null;
  tracking_url: string | null;
  delivery_partner: string | null;
}

export interface Payment {
  payment_id: number;
  user: PaymentUser;
  payment: PaymentDetails;
  order: OrderDetails;
  commission: number;
  items: PaymentItem[];
}

export interface FetchPaymentsResponse {
  detail: string;
  data: Payment[];
}

export async function fetchPayments(): Promise<FetchPaymentsResponse> {
  const token = localStorage.getItem('ecommerce_token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/payments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch payments');
  }

  return response.json();
}
