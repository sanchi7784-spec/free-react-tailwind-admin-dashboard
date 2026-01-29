// Ecommerce Authentication API
const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

export interface EcommerceLoginRequest {
  email: string;
  password: string;
}

export interface EcommerceLoginResponse {
  detail: string;
  domain: number; // 0: Super admin, 1: Mpay user, 2: Ecom user
  user_id: number;
  data: {
    access_token: string;
    token_type: string;
  };
}

export async function ecommerceLogin(
  credentials: EcommerceLoginRequest
): Promise<EcommerceLoginResponse> {
  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export interface EcommerceUser {
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  role_id: number;
  status: number;
  kyc_status: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EcommerceUsersResponse {
  detail: string;
  data: EcommerceUser[];
}

export async function getEcommerceUsers(): Promise<EcommerceUsersResponse> {
  // Get token from localStorage
  const token = localStorage.getItem('ecommerce_token');
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  console.log('Making API call to fetch users...');
  
  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', error);
    
    if (response.status === 403) {
      throw new Error('Access denied. Please login again.');
    }
    
    throw new Error(error.detail || `Failed to fetch users (Status: ${response.status})`);
  }

  return response.json();
}

export interface UpdateEcommerceUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
}

export interface UpdateEcommerceUserResponse {
  detail: string;
  data: EcommerceUser;
}

export async function updateEcommerceUser(
  userId: number,
  data: UpdateEcommerceUserRequest
): Promise<UpdateEcommerceUserResponse> {
  // Get token from localStorage
  const token = localStorage.getItem('ecommerce_token');
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  console.log('Updating user:', userId, 'with data:', data);

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  console.log('Update response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Update error:', error);
    
    if (response.status === 403) {
      throw new Error('Access denied. Please login again.');
    }
    
    throw new Error(error.detail || `Failed to update user (Status: ${response.status})`);
  }

  const result = await response.json();
  console.log('Update successful:', result);
  return result;
}
