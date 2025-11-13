import { getCookie, setCookie, deleteCookie } from "cookies-next/client";
import parseError from "./parseError";

export interface TokenData {
  token: string;
  expiresAt: number;
}

export const TOKEN_COOKIE_NAME = "session_token";
export const TOKEN_EXPIRY_COOKIE_NAME = "session_expiry";

// Add a small buffer to prevent edge cases with expiry
const EXPIRY_BUFFER = 5000; // 5 seconds

export const tokenHelper = {
  store: (token: string, expiryHours: number = 24) => {
    try {
      const expiresAt = Date.now() + 1000 * 60 * 60 * expiryHours;

      // Clear any existing tokens first
      tokenHelper.clear();

      setCookie(TOKEN_COOKIE_NAME, token, {
        expires: new Date(expiresAt),
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Secure in production
      });

      setCookie(TOKEN_EXPIRY_COOKIE_NAME, expiresAt.toString(), {
        expires: new Date(expiresAt),
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      return { token, expiresAt };
    } catch (error) {
      parseError(error, "Failed to store token");
      tokenHelper.clear();
      return null;
    }
  },

  get: (): TokenData | null => {
    try {
      const token = getCookie(TOKEN_COOKIE_NAME) as string | undefined;
      const expiresAt = getCookie(TOKEN_EXPIRY_COOKIE_NAME) as
        | string
        | undefined;

      if (!token || !expiresAt) return null;

      const expiryTime = parseInt(expiresAt);
      if (isNaN(expiryTime)) {
        tokenHelper.clear();
        return null;
      }

      return {
        token,
        expiresAt: expiryTime,
      };
    } catch (error) {
      parseError(error, "Failed to get token");
      return null;
    }
  },

  isValid: (): boolean => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) return false;

      // Add buffer time to prevent edge cases
      return Date.now() < tokenData.expiresAt - EXPIRY_BUFFER;
    } catch (error) {
      parseError(error, "Failed to validate token");
      return false;
    }
  },

  clear: () => {
    try {
      deleteCookie(TOKEN_COOKIE_NAME);
      deleteCookie(TOKEN_EXPIRY_COOKIE_NAME);
    } catch (error) {
      parseError(error, "Failed to clear token");
    }
  },

  refresh: (newToken: string) => {
    try {
      const currentToken = tokenHelper.get();
      const remainingTime = currentToken
        ? Math.max(
            1,
            Math.ceil((currentToken.expiresAt - Date.now()) / (1000 * 60 * 60)),
          )
        : 24;

      return tokenHelper.store(newToken, remainingTime);
    } catch (error) {
      parseError(error, "Failed to refresh token");
      return null;
    }
  },

  logout: () => {
    try {
      // Clear all auth-related cookies
      tokenHelper.clear();

      // Clear any other app-specific cookies if needed
      // deleteCookie('other_cookie');

      // Clear localStorage/sessionStorage if you're using any
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      return true;
    } catch (error) {
      parseError(error, "Logout failed");
      return false;
    }
  },
};
