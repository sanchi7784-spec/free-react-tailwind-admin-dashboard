// Ecommerce Authentication utilities
const ECOMMERCE_AUTH_KEY = 'ecommerce_auth';
const ECOMMERCE_TOKEN_KEY = 'ecommerce_token';
const ECOMMERCE_USER_ID_KEY = 'ecommerce_user_id';
const ECOMMERCE_DOMAIN_KEY = 'ecommerce_domain';
const ECOMMERCE_IS_VENDOR_KEY = 'ecommerce_is_vendor';

export const DOMAIN_TYPES = {
  SUPER_ADMIN: 0,
  MPAY_USER: 1,
  ECOM_USER: 2,
  VENDOR: 3,
} as const;

export type DomainType = typeof DOMAIN_TYPES[keyof typeof DOMAIN_TYPES];

export interface EcommerceAuthData {
  email: string;
  access_token: string;
  token_type: string;
  user_id?: number;
  domain?: number;
}

/**
 * Store ecommerce authentication data to localStorage
 */
export function setEcommerceAuth(data: EcommerceAuthData): void {
  localStorage.setItem(ECOMMERCE_AUTH_KEY, JSON.stringify(data));
  localStorage.setItem(ECOMMERCE_TOKEN_KEY, data.access_token);
  if (data.user_id !== undefined) {
    localStorage.setItem(ECOMMERCE_USER_ID_KEY, String(data.user_id));
  }
  if (data.domain !== undefined) {
    localStorage.setItem(ECOMMERCE_DOMAIN_KEY, String(data.domain));
  }
}

/**
 * Store authentication data directly with domain
 */
export function storeEcommerceAuth(
  userId: number,
  accessToken: string,
  domain: number
): void {
  localStorage.setItem(ECOMMERCE_TOKEN_KEY, accessToken);
  localStorage.setItem(ECOMMERCE_USER_ID_KEY, String(userId));
  localStorage.setItem(ECOMMERCE_DOMAIN_KEY, String(domain));
}

export function getEcommerceAuth(): EcommerceAuthData | null {
  const data = localStorage.getItem(ECOMMERCE_AUTH_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Get stored authentication details
 */
export function getEcommerceAuthDetails() {
  return {
    token: localStorage.getItem(ECOMMERCE_TOKEN_KEY),
    userId: localStorage.getItem(ECOMMERCE_USER_ID_KEY),
    domain: localStorage.getItem(ECOMMERCE_DOMAIN_KEY),
  };
}

/**
 * Get the domain type as a number
 */
export function getEcommerceDomain(): number | null {
  const domain = localStorage.getItem(ECOMMERCE_DOMAIN_KEY);
  return domain ? parseInt(domain, 10) : null;
}

/**
 * Check if user is authenticated for ecommerce
 */
export function isEcommerceAuthenticated(): boolean {
  const { token, userId, domain } = getEcommerceAuthDetails();
  return !!(token && userId && domain !== null);
}

/**
 * Clear ecommerce authentication data from localStorage
 */
export function clearEcommerceAuth(): void {
  localStorage.removeItem(ECOMMERCE_TOKEN_KEY);
  localStorage.removeItem(ECOMMERCE_USER_ID_KEY);
  localStorage.removeItem(ECOMMERCE_DOMAIN_KEY);
  localStorage.removeItem(ECOMMERCE_AUTH_KEY);
  localStorage.removeItem(ECOMMERCE_IS_VENDOR_KEY);
}

/**
 * Mark the current user as a vendor (has a shop)
 */
export function setVendorFlag(): void {
  localStorage.setItem(ECOMMERCE_IS_VENDOR_KEY, '1');
}

/**
 * Clear the vendor flag
 */
export function clearVendorFlag(): void {
  localStorage.removeItem(ECOMMERCE_IS_VENDOR_KEY);
}

export function getEcommerceToken(): string | null {
  return localStorage.getItem(ECOMMERCE_TOKEN_KEY);
}

/**
 * Check if user is a super admin (can see everything)
 */
export function isSuperAdmin(): boolean {
  const domain = getEcommerceDomain();
  return domain === DOMAIN_TYPES.SUPER_ADMIN;
}

/**
 * Check if user is an MPay user (can see only Gold dashboard)
 */
export function isMPayUser(): boolean {
  const domain = getEcommerceDomain();
  return domain === DOMAIN_TYPES.MPAY_USER;
}

/**
 * Check if user is an Ecommerce user (can see only Ecommerce dashboard)
 */
export function isEcomUser(): boolean {
  const domain = getEcommerceDomain();
  return domain === DOMAIN_TYPES.ECOM_USER;
}

/**
 * Check if user is a Vendor (has a shop — detected at login via profile shop_name)
 */
export function isVendor(): boolean {
  return localStorage.getItem(ECOMMERCE_IS_VENDOR_KEY) === '1';
}

/**
 * Check if user can access Ecommerce features
 */
export function canAccessEcommerce(): boolean {
  const domain = getEcommerceDomain();
  // Vendors (domain=2 with vendor flag) also count as ecommerce access
  return domain === DOMAIN_TYPES.SUPER_ADMIN || domain === DOMAIN_TYPES.ECOM_USER || isVendor();
}

/**
 * Check if user can access Gold/BBPS features
 */
export function canAccessGold(): boolean {
  const domain = getEcommerceDomain();
  return domain === DOMAIN_TYPES.SUPER_ADMIN || domain === DOMAIN_TYPES.MPAY_USER;
}

/**
 * Get user role name based on domain
 */
export function getUserRoleName(): string {
  const domain = getEcommerceDomain();
  switch (domain) {
    case DOMAIN_TYPES.SUPER_ADMIN:
      return 'Super Admin';
    case DOMAIN_TYPES.MPAY_USER:
      return 'MPay User';
    case DOMAIN_TYPES.ECOM_USER:
      return 'Ecommerce User';
    case DOMAIN_TYPES.VENDOR:
      return 'Vendor';
    default:
      return 'Unknown';
  }
}
