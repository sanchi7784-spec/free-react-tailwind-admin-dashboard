export type StaffUser = {
  user_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  role_id: number | null;
  role_name: string | null;
  status: string | null;
  created_at: string | null;
};

export type StaffResponse = {
  detail: string;
  total_staff: number;
  staff_users: StaffUser[];
};

const BASE = (import.meta as any).env?.VITE_API_BASE || "https://api.mastropaytech.com";

export async function fetchStaff(adminUserId?: string | number): Promise<StaffResponse> {
  const userId = typeof window !== "undefined" ? (adminUserId ?? localStorage.getItem("mp_user_id")) : adminUserId;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  if (!userId) {
    throw new Error("No admin user id found in localStorage (mp_user_id)");
  }

  const url = `${BASE.replace(/\/$/, "")}/dashboard/staff/${userId}`;
  const headers: Record<string,string> = { Accept: "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, { method: "GET", headers });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    // try parse json
    try {
      const json = text ? JSON.parse(text) : null;
      const msg = json?.detail || text || `${res.status} ${res.statusText}`;
      const err = new Error(msg);
      (err as any).detail = json?.detail || text;
      throw err;
    } catch (e) {
      const err = new Error(text || `${res.status} ${res.statusText}`);
      (err as any).detail = text;
      throw err;
    }
  }

  try {
    const data = text ? JSON.parse(text) : {};
    return data as StaffResponse;
  } catch (e) {
    throw new Error("Failed to parse staff response");
  }
}

export async function updateStaffRole(targetUserId: number, role_id: number): Promise<any> {
  const adminId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  if (!adminId) {
    throw new Error("No admin user id found in localStorage (mp_user_id)");
  }

  const url = `${BASE.replace(/\/$/, "")}/dashboard/staff/${targetUserId}/${adminId}`;
  const headers: Record<string,string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ role_id }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const json = text ? JSON.parse(text) : null;
      const err = new Error(json?.detail || text || `${res.status} ${res.statusText}`);
      (err as any).detail = json?.detail || text;
      throw err;
    } catch (e) {
      const err = new Error(text || `${res.status} ${res.statusText}`);
      (err as any).detail = text;
      throw err;
    }
  }

  try {
    const data = text ? JSON.parse(text) : null;
    return data;
  } catch (e) {
    return { detail: "OK" };
  }
}

export type CreateStaffPayload = {
  name: string;
  email: string;
  phone?: string;
  mpin?: string;
  role_id: number;
};

export type CreateStaffResponse = {
  detail?: string;
  user_id: number;
  name?: string;
  email?: string;
  role_id?: number;
  role_name?: string;
};

export async function createStaff(payload: CreateStaffPayload): Promise<CreateStaffResponse> {
  const adminId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  if (!adminId) {
    throw new Error("No admin user id found in localStorage (mp_user_id)");
  }

  const url = `${BASE.replace(/\/$/, "")}/dashboard/staff/${adminId}`;
  const headers: Record<string,string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const json = text ? JSON.parse(text) : null;
      const err = new Error(json?.detail || text || `${res.status} ${res.statusText}`);
      (err as any).detail = json?.detail || text;
      throw err;
    } catch (e) {
      const err = new Error(text || `${res.status} ${res.statusText}`);
      (err as any).detail = text;
      throw err;
    }
  }

  try {
    const data = text ? JSON.parse(text) : {};
    return data as CreateStaffResponse;
  } catch (e) {
    throw new Error("Failed to parse create staff response");
  }
}

export type StaffRequestResponse = {
  detail: string;
};

export async function submitStaffRequest(request_text: string): Promise<StaffRequestResponse> {
  const staffUserId = typeof window !== "undefined" ? localStorage.getItem("mp_user_id") : null;
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("mp_api_key") : null;

  if (!staffUserId) {
    throw new Error("No staff user id found in localStorage (mp_user_id)");
  }

  const url = `${BASE.replace(/\/$/, "")}/dashboard/staff-requests/${staffUserId}`;
  const headers: Record<string,string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ request_text }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const json = text ? JSON.parse(text) : null;
      const err = new Error(json?.detail || text || `${res.status} ${res.statusText}`);
      (err as any).detail = json?.detail || text;
      throw err;
    } catch (e) {
      const err = new Error(text || `${res.status} ${res.statusText}`);
      (err as any).detail = text;
      throw err;
    }
  }

  try {
    const data = text ? JSON.parse(text) : {};
    return data as StaffRequestResponse;
  } catch (e) {
    throw new Error("Failed to parse staff request response");
  }
}
