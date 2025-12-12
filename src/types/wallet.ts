export interface WalletTransaction {
  transaction_id: number;
  wallet_id: number;
  user_id: number;
  name: string | null;
  transaction_type: string | null;
  source_type: string | null;
  event_type: string | null;
  amount: number | null;
  balance_after: number | null;
  gold_grams: number | null;
  live_price: number | null;
  gold_balance_after: number | null;
  status: string | null;
  sender_user_id: number | null;
  receiver_user_id: number | null;
}

export interface WalletTransactionsResponse {
  detail: string;
  total_transactions: number;
  transactions: WalletTransaction[];
}
