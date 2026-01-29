const BASE = "https://api.mastrokart.com";

export interface ProfileData {
  name: string;
  email: string;
  phone: string | null;
  role_id: number;
  dob: string | null;
  gender: number | null;
  kyc_status: number;
  status: number;
  shop_name: string | null;
  shop_address: string | null;
  shop_logo_url: string | null;
  shop_banner_url: string | null;
  shop_description: string | null;
  shop_status: number | null;
}

export interface ProfileResponse {
  detail: string;
  data: ProfileData;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  gender?: string | number;
  dob?: string;
  shop_name?: string;
  shop_address?: string;
  shop_description?: string;
  shop_logo?: File;
  shop_banner?: File;
}

/**
 * Fetch the current user's profile
 */
export async function getProfile(): Promise<ProfileResponse> {
  // Try mp_api_key first (backward compatibility), then ecommerce_token
  const apiKey = localStorage.getItem("mp_api_key");
  const ecommerceToken = localStorage.getItem("ecommerce_token");
  const token = apiKey || ecommerceToken;
  
  if (!token) {
    throw new Error("No authorization token found");
  }

  const res = await fetch(`${BASE}/dashboard/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
      "Authorization": `Bearer ${token}`,
    },
  });

  const text = await res.text();
  
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      const msg = json?.detail || text || res.statusText;
      const err = new Error(msg);
      (err as any).detail = json?.detail || text;
      throw err;
    }
    return json;
  } catch (e: any) {
    if (!res.ok) {
      const err = new Error(text || res.statusText);
      (err as any).detail = text;
      throw err;
    }
    throw e;
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<{ detail: string }> {
  // Try mp_api_key first (backward compatibility), then ecommerce_token
  const apiKey = localStorage.getItem("mp_api_key");
  const ecommerceToken = localStorage.getItem("ecommerce_token");
  const token = apiKey || ecommerceToken;
  
  if (!token) {
    throw new Error("No authorization token found");
  }

  const formData = new FormData();

  // Append all fields to FormData
  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.password) formData.append("password", data.password);
  if (data.phone) formData.append("phone", data.phone);
  if (data.gender !== undefined) formData.append("gender", String(data.gender));
  if (data.dob) formData.append("dob", data.dob);
  if (data.shop_name) formData.append("shop_name", data.shop_name);
  if (data.shop_address) formData.append("shop_address", data.shop_address);
  if (data.shop_description) formData.append("shop_description", data.shop_description);
  if (data.shop_logo) formData.append("shop_logo", data.shop_logo);
  if (data.shop_banner) formData.append("shop_banner", data.shop_banner);

  const res = await fetch(`${BASE}/dashboard/profile/update`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();
  
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      const msg = json?.detail || text || res.statusText;
      const err = new Error(msg);
      (err as any).detail = json?.detail || text;
      throw err;
    }
    return json;
  } catch (e: any) {
    if (!res.ok) {
      const err = new Error(text || res.statusText);
      (err as any).detail = text;
      throw err;
    }
    throw e;
  }
}
