import { useEffect, useRef } from "react";
import { clearAuth } from "../utils/auth";
import { clearEcommerceAuth } from "../utils/ecommerceAuth";

interface UseIdleLogoutProps {
  timeoutMs?: number;
  /** seconds before logout to show warning (default 60s) */
  warnBeforeSeconds?: number;
}

/**
 * Component that watches user activity and logs out after `timeoutMs` of inactivity.
 * Place it near the app root so it runs for the whole session.
 */
export default function UseIdleLogout({ timeoutMs = 60 * 60 * 1000, warnBeforeSeconds = 5 }: UseIdleLogoutProps) {
  const timerRef = useRef<number | null>(null);
  const warnTimerRef = useRef<number | null>(null);
  const swalRef = useRef<any | null>(null);

  useEffect(() => {
    function clearTimer() {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    function doLogout() {
      try {
        clearAuth();
        clearEcommerceAuth();
        localStorage.removeItem('dashboardType');
        localStorage.removeItem('mp_user_id');
        localStorage.removeItem('mp_api_key');
        localStorage.removeItem('mp_auth');
      } catch (e) {
        // ignore
      }
      window.location.replace("/signin");
    }

    // Clear session data without attempting to navigate — suitable for unload handlers
    function clearSessionOnly() {
      try {
        clearAuth();
        clearEcommerceAuth();
        localStorage.removeItem('dashboardType');
        localStorage.removeItem('mp_user_id');
        localStorage.removeItem('mp_api_key');
        localStorage.removeItem('mp_auth');
      } catch (e) {
        // ignore
      }
    }

    async function showWarningAndMaybeLogout() {
      // Clear main logout timer while warning is displayed
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Try to use SweetAlert2 with no buttons and an auto-close timer.
      try {
        const Swal = (await import("sweetalert2")).default;
        swalRef.current = Swal;
        const res = await Swal.fire({
          title: "Session will expire",
          html: `You will be logged out in <strong>${warnBeforeSeconds}</strong> Seconds ,Your Session is expired.`,
          icon: "warning",
          showConfirmButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: warnBeforeSeconds * 1000,
          timerProgressBar: true,
        });

        // If Swal auto-closed via timer, proceed to logout
        if (res && (res as any).dismiss) {
          doLogout();
        }
      } catch (e) {
        // Fallback: schedule auto-logout after warnBeforeSeconds without showing blocking dialogs
        if (warnTimerRef.current) {
          window.clearTimeout(warnTimerRef.current);
        }
        warnTimerRef.current = window.setTimeout(() => {
          doLogout();
        }, warnBeforeSeconds * 1000);
      }
    }

    function startTimer() {
      clearTimer();
      // schedule main logout
      timerRef.current = window.setTimeout(() => {
        doLogout();
      }, timeoutMs);

      // schedule warning (always schedule even if warnMs <= 0 so small timeouts still show warning)
      const warnMs = Math.max(0, timeoutMs - warnBeforeSeconds * 1000);
      if (warnTimerRef.current) {
        window.clearTimeout(warnTimerRef.current);
        warnTimerRef.current = null;
      }
      warnTimerRef.current = window.setTimeout(() => {
        showWarningAndMaybeLogout();
      }, warnMs);
    }

    // Start timers immediately and do NOT consider any user activity.
    startTimer();

    // NOTE: Do NOT clear session on page unload/refresh — that causes immediate
    // logout on browser refresh. We keep session intact across refresh/close.

    return () => {
      clearTimer();
      if (warnTimerRef.current) {
        window.clearTimeout(warnTimerRef.current);
        warnTimerRef.current = null;
      }
    };
  }, [timeoutMs, warnBeforeSeconds]);

  return null;
}
