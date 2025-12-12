const BASE = "https://api.mastropaytech.com";
export async function loginRequest(email: string, mpin: string) {
  const res = await fetch(`${BASE}/dashboard/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, mpin }),
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
    // if ok but not json, return raw
    return { detail: text };
  }
}