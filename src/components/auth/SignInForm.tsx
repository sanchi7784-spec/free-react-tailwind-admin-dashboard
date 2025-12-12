import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginRequest } from "../../api/auth";
import { setAuth } from "../../utils/auth";
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [mpin, setMpin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let res: any = await loginRequest(email, mpin);
      // if API helper returned a raw JSON string, try to parse it
      if (typeof res === "string") {
        try {
          res = JSON.parse(res);
        } catch (e) {
          // leave as string
        }
      }

      const successDetail = res?.detail ?? (typeof res === "string" ? res : null);
      if (successDetail && /success/i.test(String(successDetail))) {
        setAuth({ email });
        // store user id for role-based dashboard behavior
        if (res && (res.user_id || res.userId || res.user)) {
          const uid = res.user_id ?? res.userId ?? res.user;
          try {
            localStorage.setItem('mp_user_id', String(uid));
          } catch (e) {
            // ignore storage errors
          }
        }
        // redirect to dashboard root
        window.location.replace("/");
        return;
      }

      setError(typeof successDetail === "string" ? successDetail : "Login failed");
    } catch (err: any) {
      // Normalize various error shapes to pull out `.detail` when present
      let message: string | null = null;
      if (!err) message = "Login failed";
      else if (typeof err === "string") message = err;
      else if (err.detail) message = String(err.detail);
      else if (err.detail) message = String(err.detail);
      else {
        try {
          const maybe = JSON.stringify(err);
          message = maybe;
        } catch (e) {
          message = "Login failed";
        }
      }

      // if message looks like JSON with a detail field, extract it
      try {
        if (message && message.trim().startsWith("{")) {
          const parsed = JSON.parse(message);
          if (parsed?.detail) message = String(parsed.detail);
        }
      } catch (e) {
        // ignore parse errors
      }

      setError(message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
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
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your Password" value={mpin} onChange={(e: any) => setMpin(e.target.value)} />
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
                <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">Forgot password?</Link>
              </div>
              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account? {" "}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}