export const PAYMENT_METHOD_MAP = { 0: 'cod', 1: 'online' } as const;
export type PaymentMethod = typeof PAYMENT_METHOD_MAP[keyof typeof PAYMENT_METHOD_MAP];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  online: 'Online Payment',
};

export function getPaymentMethodLabel(key?: number | null): string {
  const numKey = Number(key);
  const has = Object.prototype.hasOwnProperty.call(PAYMENT_METHOD_MAP, numKey);
  const v = has ? (PAYMENT_METHOD_MAP as Record<number, PaymentMethod>)[numKey] : undefined;
  return v ? PAYMENT_METHOD_LABELS[v] : `Unknown (${String(key)})`;
}

export const PAYMENT_STATUS_MAP = { 0: 'pending', 1: 'paid', 2: 'failed', 3: 'refund_initiated', 4: 'refunded' } as const;
export type PaymentStatus = typeof PAYMENT_STATUS_MAP[keyof typeof PAYMENT_STATUS_MAP];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refund_initiated: 'Refund Initiated',
  refunded: 'Refunded',
};

export function getPaymentStatusLabel(key?: number | null): string {
  const numKey = Number(key);
  const has = Object.prototype.hasOwnProperty.call(PAYMENT_STATUS_MAP, numKey);
  const v = has ? (PAYMENT_STATUS_MAP as Record<number, PaymentStatus>)[numKey] : undefined;
  return v ? PAYMENT_STATUS_LABELS[v] : `Unknown (${String(key)})`;
}
