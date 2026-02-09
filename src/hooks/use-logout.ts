"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/hooks/use-business";
import { logout } from "@/lib/server-actions";
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
  const router = useRouter();
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
      const result = await logout();

      if (result.success) {
        // Redirect to business login if applicable, otherwise root
        const redirectTo =
          !hasBusinessToken && businessId ? `/login/${businessId}` : "/";
        router.push(redirectTo);
      }
    } catch (error) {
      parseError(error, "Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, business?.business_id, hasBusinessToken, router]);

  return {
    handleLogout,
    isLoggingOut,
  };
}
