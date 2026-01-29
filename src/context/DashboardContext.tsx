import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getEcommerceDomain, DOMAIN_TYPES } from '../utils/ecommerceAuth';

export type DashboardType = 'ecommerce' | 'bbps' | 'gold';

interface DashboardContextType {
  dashboardType: DashboardType;
  setDashboardType: (type: DashboardType) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

/**
 * Get the correct default dashboard type based on user domain
 */
function getDefaultDashboardType(): DashboardType {
  const domain = getEcommerceDomain();
  
  // Domain 2 (Ecom User) -> Always ecommerce
  if (domain === DOMAIN_TYPES.ECOM_USER) {
    return 'ecommerce';
  }
  
  // Domain 1 (MPay User) -> Always gold
  if (domain === DOMAIN_TYPES.MPAY_USER) {
    return 'gold';
  }
  
  // Domain 0 (Super Admin) or no domain -> Check localStorage or default to gold
  const stored = localStorage.getItem('dashboardType');
  return (stored as DashboardType) || 'gold';
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardType, setDashboardTypeState] = useState<DashboardType>(() => {
    return getDefaultDashboardType();
  });

  // Validate dashboard type on mount and when auth changes
  useEffect(() => {
    const domain = getEcommerceDomain();
    
    if (domain === DOMAIN_TYPES.ECOM_USER && dashboardType !== 'ecommerce') {
      // Ecom users must use ecommerce dashboard
      setDashboardTypeState('ecommerce');
      localStorage.setItem('dashboardType', 'ecommerce');
    } else if (domain === DOMAIN_TYPES.MPAY_USER && dashboardType === 'ecommerce') {
      // MPay users cannot access ecommerce dashboard
      setDashboardTypeState('gold');
      localStorage.setItem('dashboardType', 'gold');
    }
  }, [dashboardType]);

  const setDashboardType = (type: DashboardType) => {
    const domain = getEcommerceDomain();
    
    // Validate that user can access this dashboard type
    if (domain === DOMAIN_TYPES.ECOM_USER && type !== 'ecommerce') {
      console.warn('Ecommerce users can only access ecommerce dashboard');
      return;
    }
    
    if (domain === DOMAIN_TYPES.MPAY_USER && type === 'ecommerce') {
      console.warn('MPay users cannot access ecommerce dashboard');
      return;
    }
    
    setDashboardTypeState(type);
    localStorage.setItem('dashboardType', type);
  };

  return (
    <DashboardContext.Provider value={{ dashboardType, setDashboardType }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
