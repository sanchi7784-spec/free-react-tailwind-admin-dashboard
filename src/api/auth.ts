const BASE = "https://api.mastrokart.com";

export interface LoginResponse {
  detail: string;
  domain: number; // 0: Super admin, 1: Mpay user, 2: Ecom user
  user_id: number;
  data: {
    access_token: string;
    token_type: string;
  };
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/dashboard/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const text = await res.text();
  let json: any = null;
  
  try {
    json = JSON.parse(text);
  } catch (parseError) {
    // Not valid JSON
    if (!res.ok) {
      throw new Error(text || res.statusText || "Login failed");
    }
    throw new Error("Invalid response format from server");
  }
  
  if (!res.ok) {
    const msg = json?.detail || text || res.statusText || "Login failed";
    const err = new Error(msg);
    (err as any).detail = json?.detail || text;
    throw err;
  }
  
  return json;
}