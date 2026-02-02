// Vendors API
const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

// API Response Interface
export interface VendorApiResponse {
  vendor_id: number;
  vendor_name: string;
  email: string;
  phone: string;
  gender: number;
  dob: string;
  status: number;
  shop_id: number;
  shop_name: string;
  shop_address: string;
  description: string;
  shop_logo_url: string;
  shop_banner_url: string;
  shop_status: number;
  created_at: string;
  updated_at: string;
}

// Frontend Interface
export interface Vendor {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  taxId: string;
  status: number | string;
  rating: number;
  totalOrders: number;
  joinedDate: string;
  // Additional API fields
  shopId?: number;
  shopLogoUrl?: string;
  shopBannerUrl?: string;
  description?: string;
  gender?: number;
  dob?: string;
  [key: string]: any;
}

export interface VendorsResponse {
  detail?: string;
  data?: VendorApiResponse[];
  vendors?: VendorApiResponse[];
  [key: string]: any;
}

// Transform API response to frontend format
function transformVendor(apiVendor: VendorApiResponse): Vendor {
  return {
    id: apiVendor.vendor_id,
    companyName: apiVendor.shop_name || apiVendor.vendor_name,
    contactPerson: apiVendor.vendor_name,
    email: apiVendor.email,
    phone: apiVendor.phone,
    address: apiVendor.shop_address || '',
    city: '', // Not provided by API
    country: '', // Not provided by API
    zipCode: '', // Not provided by API
    taxId: `TAX-${apiVendor.vendor_id}`, // Generated from vendor_id
    status: apiVendor.shop_status, // Use shop_status: 0=inactive, 1=active, 2=deleted
    rating: 0, // Not provided by API
    totalOrders: 0, // Not provided by API
    joinedDate: apiVendor.created_at.split(' ')[0], // Extract date part
    // Additional fields
    shopId: apiVendor.shop_id,
    shopLogoUrl: apiVendor.shop_logo_url,
    shopBannerUrl: apiVendor.shop_banner_url,
    description: apiVendor.description,
    gender: apiVendor.gender,
    dob: apiVendor.dob,
  };
}

export async function fetchVendors(): Promise<Vendor[]> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/vendors`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch vendors');
  }

  const result: VendorsResponse = await response.json();
  const apiVendors = result.data || result.vendors || [];
  
  // Transform API response to frontend format
  return apiVendors.map(transformVendor);
}

// Create Vendor Interface
export interface CreateVendorData {
  vendor_name: string;
  phone: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  shop_name: string;
  shop_address: string;
  description: string;
  shop_logo: File;
  shop_banner: File;
}

export interface CreateVendorResponse {
  detail: string;
  data?: VendorApiResponse;
  [key: string]: any;
}

export async function createVendor(data: CreateVendorData): Promise<CreateVendorResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('vendor_name', data.vendor_name);
  formData.append('phone', data.phone);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('gender', data.gender);
  formData.append('dob', data.dob);
  formData.append('shop_name', data.shop_name);
  formData.append('shop_address', data.shop_address);
  formData.append('description', data.description);
  formData.append('shop_logo', data.shop_logo);
  formData.append('shop_banner', data.shop_banner);

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/vendors/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    // Handle validation errors (422) which may have multiple field errors
    if (response.status === 422 && error.detail) {
      if (Array.isArray(error.detail)) {
        const errorMessages = error.detail.map((err: any) => 
          `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg || err.message || JSON.stringify(err)}`
        ).join(', ');
        throw new Error(errorMessages);
      } else if (typeof error.detail === 'string') {
        throw new Error(error.detail);
      } else {
        throw new Error(JSON.stringify(error.detail));
      }
    }
    
    throw new Error(error.detail || error.message || 'Failed to create vendor');
  }

  return response.json();
}

// Update Vendor Interface
export interface UpdateVendorData {
  vendor_name: string;
  phone: string;
  email: string;
  password?: string;
  gender: string;
  dob: string;
  shop_name: string;
  shop_address: string;
  description: string;
  shop_status?: string;
  shop_logo?: File | null;
  shop_banner?: File | null;
}

export interface UpdateVendorResponse {
  detail: string;
  data?: VendorApiResponse;
  [key: string]: any;
}

export async function updateVendor(vendorId: number, data: UpdateVendorData): Promise<UpdateVendorResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('vendor_name', data.vendor_name);
  formData.append('phone', data.phone);
  formData.append('email', data.email);
  if (data.password) {
    formData.append('password', data.password);
  }
  formData.append('gender', data.gender);
  formData.append('dob', data.dob);
  formData.append('shop_name', data.shop_name);
  formData.append('shop_address', data.shop_address);
  formData.append('description', data.description);
  if (data.shop_status !== undefined) {
    formData.append('shop_status', data.shop_status);
  }
  if (data.shop_logo) {
    formData.append('shop_logo', data.shop_logo);
  }
  if (data.shop_banner) {
    formData.append('shop_banner', data.shop_banner);
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/vendors/update/${vendorId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update vendor');
  }

  return response.json();
}
