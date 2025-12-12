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

export async function fetchUsers(): Promise<UsersResponse> {
  const userId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  const listUrl = userId ? `${BASE.replace(/\/$/, "")}/dashboard/users/${userId}` : `${BASE.replace(/\/$/, "")}/dashboard/users`;
  const singleUrl = userId ? `${BASE.replace(/\/$/, "")}/dashboard/users/${userId}` : null;

 
  let res = await fetch(listUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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
        throw new Error(`Failed to fetch users: ${res.status} ${text}`);
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
  throw new Error(`Failed to fetch users: ${res.status} ${text}`);
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
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch user ${id}: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data as ApiUser;
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
  const adminId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

 
  const url = adminId 
    ? `${BASE}/dashboard/users/${id}/${adminId}` 
    : `${BASE}/dashboard/users/${id}`;

  async function send(method: string, extraHeaders?: Record<string,string>) {
    const headers: Record<string,string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(extraHeaders || {}),
    };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

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
    throw new Error(`Failed to update user ${id}: ${attempt.res.status} ${attempt.text}`);
  }

  return attempt.data;
}
