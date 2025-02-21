"use client";
import React, { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import { setTokenData, selectToken } from "@/redux/slice/token/tokenSlice";
import { tokenHelper } from "@/lib/token-helper";
import { usePathname, useRouter } from "next/navigation";
import LoadingOverlay from "@/components/loading-overlay";

const PUBLIC_PATHS = ['/expired', '/login', '/signup', '/reset-password'];
const CHECK_INTERVAL = 30000; // 30 seconds

const TokenInitialize = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectToken);
  const router = useRouter();
  const pathname = usePathname();
  const initializingRef = useRef(false);
  const isLoadingRef = useRef(true);
  const [showLoading, setShowLoading] = React.useState(true);

  const initializeToken = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    isLoadingRef.current = true;
    setShowLoading(true);

    try {
      const tokenData = tokenHelper.get();
      
      if (tokenData && tokenHelper.isValid()) {
        dispatch(setTokenData(tokenData));
      } else {
        tokenHelper.clear();
        dispatch(setTokenData(null));
        
        if (!PUBLIC_PATHS.includes(pathname)) {
          router.push('/expired');
        }
      }
    } catch (error) {
      console.error('Token initialization failed:', error);
      dispatch(setTokenData(null));
    } finally {
      // Use RAF to ensure smooth transition
      requestAnimationFrame(() => {
        setTimeout(() => {
          isLoadingRef.current = false;
          initializingRef.current = false;
          setShowLoading(false);
        }, 300);
      });
    }
  }, [dispatch, router, pathname]);

  useEffect(() => {
    // Only initialize if not already initialized
    if (isLoadingRef.current) {
      initializeToken();
    }

    const interval = setInterval(() => {
      if (!tokenHelper.isValid() && isAuthenticated) {
        initializeToken();
      }
    }, CHECK_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        initializeToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializeToken, isAuthenticated]);

  return (
    <>
      {showLoading && <LoadingOverlay />}
      {children}
    </>
  );
};

export default TokenInitialize;
