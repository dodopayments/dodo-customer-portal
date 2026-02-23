"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useBusiness } from "@/hooks/use-business";
import parseError from "@/lib/clientErrorHelper";

interface UseLogoutOptions {
  /**
   * Whether the user logged in via a business-specific token.
   * Influences the post-logout redirect strategy.
   * If not provided, will be read from BusinessContext.
   */
  hasBusinessToken?: boolean;
}

/**
 * Handle logout logic and redirection.
 */
export function useLogout(options: UseLogoutOptions = {}) {
  const businessContext = useBusiness();
  // Use option if provided, otherwise fall back to context value
  const hasBusinessToken = options.hasBusinessToken ?? businessContext.hasBusinessToken ?? false;
  const { business } = businessContext;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const businessIdRef = useRef<string | undefined>(undefined);

  // Store business ID in a ref to ensure it's available during/after logout
  useEffect(() => {
    if (business?.business_id) {
      businessIdRef.current = business.business_id;
    }
  }, [business?.business_id]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      const businessId = business?.business_id || businessIdRef.current;

      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");

      const redirectTo =
        !hasBusinessToken && businessId ? `/login/${businessId}` : "/";
      window.location.replace(redirectTo);
    } catch (error) {
      parseError(error, "Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, business?.business_id, hasBusinessToken]);

  return {
    handleLogout,
    isLoggingOut,
  };
}
