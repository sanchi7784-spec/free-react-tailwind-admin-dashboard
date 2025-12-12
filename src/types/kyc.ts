export interface KycRecordApi {
  kyc_id: number;
  user_id: number;
  name: string;
  email: string;
  aadhaar_number: string | null;
  aadhaar_front_url?: string | null;
  aadhaar_back_url?: string | null;
  pan_number?: string | null;
  pan_image_url?: string | null;
  // 0 = Pending, 1 = Approved, 2 = Rejected
  is_verified: 0 | 1 | 2;
  reason?: string | null;
  verified_at?: string | null;
  created_at: string;
}

export interface KycResponse {
  detail?: string;
  total_records?: number;
  kyc_records: KycRecordApi[];
}
