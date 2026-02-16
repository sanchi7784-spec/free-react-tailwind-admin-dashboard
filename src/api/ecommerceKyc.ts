// Ecommerce KYC API
const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

export interface KYCDocument {
  kyc_id: number;
  user_id: number;
  user_name: string;
  aadhaar_front_url: string | null;
  aadhaar_back_url: string | null;
  pan_card_url: string | null;
  aadhaar_number: string | null;
  pan_number: string | null;
  is_verified: number; // 0: pending, 1: approved, 2: rejected
  reason: string | null;
  verified_by_name: string | null;
  verified_by_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface KYCListResponse {
  kyc_documents: KYCDocument[];
  total: number;
  page: number;
  limit: number;
}

export async function getAllKYC(token: string): Promise<KYCDocument[]> {
  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/kyc`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch KYC documents');
  }

  const result = await response.json();
  return result.data || [];
}

export async function updateKYCStatus(
  token: string,
  kycId: number,
  isVerified: number,
  reason?: string
): Promise<void> {
  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/kyc/update/${kycId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_verified: isVerified, reason }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update KYC status');
  }
}
