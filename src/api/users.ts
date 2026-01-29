export type ApiUser = {
  user_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  dob: string | null;
  // API may return numeric codes for gender/status (int mapping), or strings.
  // gender: 1 -> male, 2 -> female, 3 -> other
  // status: 1 -> active, 0 -> inactive
  gender: number | string | null;
  status: number | string | null;
  kyc_verified: string | null;
  wallet_balance: number | null;
  mpin?: string | null;
};

export type UsersResponse = {
  detail: string;
  total_users: number;
  users: ApiUser[];
};


const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";

export type UpdateStatusResponse = {
  detail: string;
};

export async function updateUserStatus(userId: number, status: number): Promise<UpdateStatusResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  
  if (!token) {
    throw new Error("Authentication token not found. Please login first.");
  }
  
  const url = `https://api.mastrokart.com/dashboard/users/status/${userId}`;
  
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON
    }
    const message = errorData?.detail || text || `Failed to update user status: ${res.status}`;
    throw new Error(message);
  }
  
  return await res.json();
}

export async function fetchUsers(): Promise<UsersResponse> {
  // Use correct user ID based on domain
  const domain = typeof window !== "undefined" ? localStorage.getItem("ecommerce_domain") : null;
  let userId: string | null = null;
  
  if (domain === "2") {
    // Ecommerce user - use ecommerce_user_id only
    userId = typeof window !== "undefined" ? localStorage.getItem("ecommerce_user_id") : null;
  } else {
    // MPay/Super Admin - try mp_user_id first, then ecommerce_user_id
    userId = typeof window !== "undefined" 
      ? (localStorage.getItem("mp_user_id") || localStorage.getItem("ecommerce_user_id"))
      : null;
  }
  
  // Try mp_api_key first (for backward compatibility with domain 0 & 1)
  // Then fallback to ecommerce_token (unified auth system)
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const ecommerceToken = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  const token = apiKey || ecommerceToken;

  const listUrl = userId ? `${BASE.replace(/\/$/, "")}/dashboard/users/${userId}` : `${BASE.replace(/\/$/, "")}/dashboard/users`;
  const singleUrl = userId ? `${BASE.replace(/\/$/, "")}/dashboard/users/${userId}` : null;

 
  let res = await fetch(listUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });


  if (res.ok) {
    const data = (await res.json()) as UsersResponse;
    return data;
  }

  // If list endpoint failed and we have a userId, try the per-user path as a fallback
  if (singleUrl) {
    try {
      res = await fetch(singleUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let errorData: any = null;
        try {
          errorData = text ? JSON.parse(text) : null;
        } catch (e) {
          // Not JSON
        }
        const message = errorData?.detail || text || `Failed to fetch users: ${res.status}`;
        const err = new Error(message);
        (err as any).detail = errorData?.detail || text;
        throw err;
      }

      const json = await res.json();
     
      if (json && Array.isArray(json.users)) {
        return json as UsersResponse;
      }

    
      if (json && (json.user_id || json.user_id === 0)) {
        const single = json as ApiUser;
        return { detail: "", total_users: 1, users: [single] } as UsersResponse;
      }

    
      throw new Error(`Unexpected users response shape from ${singleUrl}`);
    } catch (e: any) {
      throw e;
    }
  }


  const text = await res.text().catch(() => "");
  let errorData: any = null;
  try {
    errorData = text ? JSON.parse(text) : null;
  } catch (e) {
    // Not JSON
  }
  const message = errorData?.detail || text || `Failed to fetch users: ${res.status}`;
  const err = new Error(message);
  (err as any).detail = errorData?.detail || text;
  throw err;
}

export async function fetchUser(id: number): Promise<ApiUser> {
  const res = await fetch(`${BASE}/dashboard/users/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 405) {
    try {
      const list = await fetchUsers();
      const found = list.users.find((u) => u.user_id === id);
      if (found) return found;
      throw new Error(`User ${id} not found in users list fallback`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to fetch user ${id}: ${res.status} ${text} (and list fallback failed: ${String(e)})`);
    }
  }

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData?.detail || `Failed to fetch user ${id}: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to fetch user ${id}: ${res.status}`);
    }
  }

  const data = await res.json();
  return data as ApiUser;
}

export type UserDetailResponse = {
  detail: string;
  user_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role_id: number;
  dob: string | null;
  gender: string | null;
};

export async function fetchUserDetails(userId: string): Promise<UserDetailResponse> {
  // Try mp_api_key first (for backward compatibility with domain 0 & 1)
  // Then fallback to ecommerce_token (unified auth system)
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const ecommerceToken = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  const token = apiKey || ecommerceToken;

  if (!token) {
    throw new Error("Authentication token not found. Please login first.");
  }

  const res = await fetch(`${BASE}/dashboard/admin/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData?.detail || `Failed to fetch user details: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to fetch user details: ${res.status}`);
    }
  }

  const data = await res.json();
  return data as UserDetailResponse;
}

export type UpdateUserDetailsPayload = {
  name?: string;
  email?: string;
  phone?: string;
  mpin?: string;
  dob?: string;
  gender?: number | string;
};

export type UpdateUserDetailsResponse = {
  detail: string;
  user_id: number;
};

export async function updateUserDetails(
  userId: string,
  payload: UpdateUserDetailsPayload
): Promise<UpdateUserDetailsResponse> {
  // Try mp_api_key first (for backward compatibility with domain 0 & 1)
  // Then fallback to ecommerce_token (unified auth system)
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const ecommerceToken = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  const token = apiKey || ecommerceToken;

  if (!token) {
    throw new Error("Authentication token not found. Please login first.");
  }

  const res = await fetch(`${BASE}/dashboard/admin/user/${userId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData?.detail || `Failed to update user details: ${res.status}`);
    } catch (e) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to update user details: ${res.status}`);
    }
  }

  const data = await res.json();
  return data as UpdateUserDetailsResponse;
}

export async function probeUserMethods(id: number): Promise<{ status: number; headers: Record<string,string>; text: string }> {
  const res = await fetch(`${BASE}/dashboard/users/${id}`, {
    method: "OPTIONS",
    headers: {
      Accept: "application/json",
    },
  });

  const text = await res.text();
  const headers: Record<string,string> = {};
  try {
    res.headers.forEach((v, k) => {
      headers[k] = v;
    });
  } catch (e) {
    // ignore
  }

  return { status: res.status, headers, text };
}

export type UpdateUserPayload = Partial<{
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: number | string;
  status: number | string;
  wallet_balance: number | string;
  kyc_verified: string;
  mpin: string;
}>;

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<any> {
  // Use correct user ID based on domain
  const domain = typeof window !== "undefined" ? localStorage.getItem("ecommerce_domain") : null;
  let adminId: string | null = null;
  
  if (domain === "2") {
    // Ecommerce user - use ecommerce_user_id only
    adminId = typeof window !== "undefined" ? localStorage.getItem("ecommerce_user_id") : null;
  } else {
    // MPay/Super Admin - try mp_user_id first, then ecommerce_user_id
    adminId = typeof window !== "undefined" 
      ? (localStorage.getItem("mp_user_id") || localStorage.getItem("ecommerce_user_id"))
      : null;
  }
  
  // Try mp_api_key first (for backward compatibility with domain 0 & 1)
  // Then fallback to ecommerce_token (unified auth system)
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;
  const ecommerceToken = typeof window !== "undefined" ? localStorage.getItem("ecommerce_token") : null;
  const token = apiKey || ecommerceToken;

 
  const url = adminId 
    ? `${BASE}/dashboard/users/${id}/${adminId}` 
    : `${BASE}/dashboard/users/${id}`;

  async function send(method: string, extraHeaders?: Record<string,string>) {
    const headers: Record<string,string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(extraHeaders || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {

    }

    return { res, text, data };
  }


  let attempt = await send("PATCH");

  if (attempt.res.status === 405) {
    attempt = await send("PUT");
  }

  if (attempt.res.status === 405) {
    attempt = await send("POST", { "X-HTTP-Method-Override": "PATCH" });
  }

  if (!attempt.res.ok) {
    let errorMessage = `Failed to update user ${id}: ${attempt.res.status}`;
    if (attempt.data?.detail) {
      errorMessage = attempt.data.detail;
    } else if (attempt.text) {
      errorMessage = attempt.text;
    }
    throw new Error(errorMessage);
  }

  return attempt.data;
}
