// Ads/Banner API
const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

export enum AdStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export const AD_STATUS_MAP = {
  0: 'inactive',
  1: 'active',
  2: 'deleted',
} as const;

export interface Ad {
  ad_id: number;
  title: string;
  image_url: string;
  status: AdStatus;
  added_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdsResponse {
  detail?: string;
  data: Ad[];
}

export interface CreateAdResponse {
  detail: string;
  data?: Ad;
}

export interface UpdateAdResponse {
  detail: string;
  data?: Ad;
}

/**
 * Fetch all ads/banners
 */
export async function fetchAds(): Promise<AdsResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/ads`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch ads');
  }

  return response.json();
}

/**
 * Create a new ad/banner
 */
export async function createAd(
  title: string,
  adImage: File
): Promise<CreateAdResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('ad_image', adImage);

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/ads/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create ad');
  }

  return response.json();
}

/**
 * Update an existing ad/banner
 */
export async function updateAd(
  adId: number,
  title?: string,
  adImage?: File,
  status?: AdStatus
): Promise<UpdateAdResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  
  if (title !== undefined) {
    formData.append('title', title);
  }
  
  if (adImage) {
    formData.append('ad_image', adImage);
  }
  
  if (status !== undefined) {
    formData.append('status', status.toString());
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/ads/update/${adId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update ad');
  }

  return response.json();
}

/**
 * Get status label from status code
 */
export function getAdStatusLabel(status: AdStatus): string {
  return AD_STATUS_MAP[status] || 'unknown';
}

/**
 * Get status badge color class
 */
export function getAdStatusColor(status: AdStatus): string {
  switch (status) {
    case AdStatus.ACTIVE:
      return 'bg-green-500 text-white';
    case AdStatus.INACTIVE:
      return 'bg-yellow-500 text-white';
    case AdStatus.DELETED:
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}
