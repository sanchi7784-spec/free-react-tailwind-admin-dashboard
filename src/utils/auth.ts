const STORAGE_KEY = "mp_auth";
export interface AuthInfo {
  email: string;
}
export function setAuth(info: AuthInfo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
  }
}
export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}
export function getAuth(): AuthInfo | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    return JSON.parse(v) as AuthInfo;
  } catch (e) {
    return null;
  }
}
export function isAuthenticated(): boolean {
  return getAuth() !== null;
}
export default { setAuth, clearAuth, getAuth, isAuthenticated };
