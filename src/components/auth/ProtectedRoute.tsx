import { Navigate, useLocation } from "react-router";
import { 
  isEcommerceAuthenticated, 
  canAccessEcommerce, 
  canAccessGold,
  isSuperAdmin 
} from "../../utils/ecommerceAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEcommerce?: boolean;
  requireGold?: boolean;
}

/**
 * Protected route wrapper that checks domain-based access
 * - requireEcommerce: Route requires ecommerce access (domain 0 or 2)
 * - requireGold: Route requires gold/BBPS access (domain 0 or 1)
 */
export default function ProtectedRoute({ 
  children, 
  requireEcommerce = false,
  requireGold = false 
}: ProtectedRouteProps) {
  const location = useLocation();

  // Check if user is authenticated
  if (!isEcommerceAuthenticated()) {
    // Redirect to appropriate login page
    if (requireEcommerce) {
      return <Navigate to="/ecommerce/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check domain-based access
  if (requireEcommerce && !canAccessEcommerce()) {
    // User doesn't have ecommerce access
    return <Navigate to="/" replace />;
  }

  if (requireGold && !canAccessGold()) {
    // User doesn't have gold/BBPS access
    return <Navigate to="/ecom" replace />;
  }

  // User has required access
  return <>{children}</>;
}
