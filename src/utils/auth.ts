const STORAGE_KEY = "mp_auth";
export interface AuthInfo {
  email: string;
  user_id?: string;
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
    localStorage.removeItem('mp_user_id');
    localStorage.removeItem('mp_api_key');
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
export function getUserId(): string | null {
  // First check the auth object
  const auth = getAuth();
  if (auth?.user_id) return auth.user_id;
  
  // Fallback to old localStorage key for backwards compatibility
  try {
    return localStorage.getItem('mp_user_id');
  } catch (e) {
    return null;
  }
}
export function isAuthenticated(): boolean {
  // User is authenticated if mp_auth exists
  // user_id check is done at the component level for better error handling
  return getAuth() !== null;
}
export default { setAuth, clearAuth, getAuth, isAuthenticated, getUserId };
