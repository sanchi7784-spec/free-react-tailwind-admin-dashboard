import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginRequest, LoginResponse } from "../../api/auth";
import { setAuth } from "../../utils/auth";
import { storeEcommerceAuth } from "../../utils/ecommerceAuth";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Client-side validation to avoid confusing object errors
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    
    try {
      const res = await loginRequest(email, password);
      
      // Check if login was successful
      if (res.detail && /success/i.test(res.detail)) {
        // Store old auth format for compatibility
        setAuth({ email });
        
        // Store new auth with domain
        storeEcommerceAuth(res.user_id, res.data.access_token, res.domain);
        
        // Handle old system compatibility based on domain
        if (res.domain === 0 || res.domain === 1) {
          // For Gold/BBPS users, also store in old format
          localStorage.setItem('mp_user_id', String(res.user_id));
          localStorage.setItem('mp_api_key', res.data.access_token);
        } else if (res.domain === 2) {
          // For Ecommerce users, clear old format to prevent conflicts
          localStorage.removeItem('mp_user_id');
          localStorage.removeItem('mp_api_key');
        }
        
        // Set dashboard type based on domain
        // Domain 0 (Super Admin) -> Gold dashboard (can access all)
        // Domain 1 (MPay User) -> Gold dashboard
        // Domain 2 (Ecom User) -> Ecommerce dashboard
        if (res.domain === 2) {
          localStorage.setItem('dashboardType', 'ecommerce');
          window.location.replace("/ecom");
        } else {
          localStorage.setItem('dashboardType', 'gold');
          window.location.replace("/");
        }
        return;
      }
      
      const formatDetail = (d: any) => {
        if (!d) return null;
        if (typeof d === "string") return d;
        if (typeof d === "object") {
          if ((d as any).message) return (d as any).message;
          try {
            return JSON.stringify(d);
          } catch {
            return String(d);
          }
        }
        return String(d);
      };

      setError(formatDetail(res.detail) || "Login failed");
    } catch (err: any) {
      const formatDetail = (d: any) => {
        if (!d) return null;
        if (typeof d === "string") return d;
        if (typeof d === "object") {
          if ((d as any).message) return (d as any).message;
          try {
            return JSON.stringify(d);
          } catch {
            return String(d);
          }
        }
        return String(d);
      };

      let message = "Login failed";
      if (err?.message) {
        message = err.message;
      } else if (err?.detail) {
        message = formatDetail(err.detail) || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        {/* <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link> */}
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign in!</p>
       </div>
          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Sign in with your account</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input placeholder="info@gmail.com" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                  </span>
                </div>
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">Keep me logged in</span>
                </div>
                {/* <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">Forgot password?</Link> */}
              </div>
              <div>
                <Button className="w-full bg-stone-950" size="sm" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account? {" "}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Sign Up</Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}