/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/turnstile.ts
import { MutableRefObject } from "react";
import parseError from "./serverErrorHelper";

export interface TurnstileState {
  token?: string;
  error: string | null;
}

export interface TurnstileHandlers {
  setToken: (token?: string) => void;
  setError: (error: string | null) => void;
  resetTurnstile: () => void;
}

export const TURNSTILE_ERROR_MESSAGES = {
  REQUIRED: "Please complete the security verification.",
  EXPIRED: "Security verification has expired. Please try again.",
  ERROR: "Security verification failed. Please try again.",
};

export const createTurnstileHandlers = (
  turnstileRef: MutableRefObject<any>,
  setState: (state: TurnstileState) => void,
): TurnstileHandlers => {
  const setToken = (token?: string) => {
    setState({ token, error: null });
  };

  const setError = (error: string | null) => {
    setState({ token: undefined, error });
  };

  const resetTurnstile = () => {
    if (turnstileRef.current?.reset) {
      turnstileRef.current.reset();
      setState({ token: undefined, error: null });
    }
  };

  return {
    setToken,
    setError,
    resetTurnstile,
  };
};

export const handleTurnstileError = (
  error: string,
  handlers: TurnstileHandlers,
) => {
  handlers.setError(TURNSTILE_ERROR_MESSAGES.ERROR);
  parseError(error, "Turnstile verification failed");
};

export const handleTurnstileExpired = (handlers: TurnstileHandlers) => {
  handlers.setError(TURNSTILE_ERROR_MESSAGES.EXPIRED);
};

export const validateTurnstileToken = (token?: string): boolean => {
  if (!token) {
    return false;
  }
  return true;
};
