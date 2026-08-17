"use client";

import { toast } from "sonner";
import {
  isBusinessArchived,
  isBusinessLookupFailure,
} from "./business-archived";

interface ErrorPayload {
  message?: string;
  errors?: Array<{ message?: string }>;
}

interface ErrorDetails {
  status?: number;
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

function isErrorDetails(value: unknown): value is ErrorDetails {
  return typeof value === "object" && value !== null;
}

function extractResponseMessage(responseData: unknown): string | undefined {
  if (!responseData) return undefined;
  if (typeof responseData === "string") return responseData;
  if (typeof responseData !== "object") return undefined;

  const payload = responseData as ErrorPayload;
  if (payload.message && typeof payload.message === "string") {
    return payload.message;
  }

  if (Array.isArray(payload.errors)) {
    const fallback = payload.errors.find(
      (item) => item && typeof item.message === "string"
    );
    if (fallback?.message) return fallback.message;
  }

  return undefined;
}

function sanitizeMessage(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  const trimmedMessage = message.trim();
  return trimmedMessage.length > 0 ? trimmedMessage : fallback;
}

export interface ParsedError {
  message: string;
  severity: "error" | "warning";
}

/**
 * Resolves an unknown error into a user-facing message without displaying it.
 *
 * Use this when the error needs to be rendered inline (next to the offending
 * field, or as a persistent banner) instead of, or in addition to, a toast.
 * `parseError` is a thin wrapper around this for the toast-only case.
 */
export function getErrorMessage(
  error: unknown,
  customMessage?: string,
  storeFront?: boolean
): ParsedError {
  const defaultMessage = customMessage || "Something went wrong";

  if (!isErrorDetails(error)) {
    const fallback = error instanceof Error ? error.message : undefined;
    return {
      message: sanitizeMessage(fallback, defaultMessage),
      severity: "error",
    };
  }

  const status = error.status ?? error.response?.status;

  // Checked before the generic 401/403 branch, which would otherwise absorb it
  // into a dismissible "not authorized" warning. This one is terminal.
  if (isBusinessArchived(status, error.response?.data)) {
    return {
      message: "This store is no longer available. Please contact the merchant.",
      severity: "error",
    };
  }

  if (isBusinessLookupFailure(status, error.response?.data)) {
    return {
      message: "We could not reach this store. Please try again shortly.",
      severity: "warning",
    };
  }

  if (status === 401 || status === 403) {
    return {
      message: "You are not authorized to perform this action",
      severity: "warning",
    };
  }

  if (storeFront && status === 409) {
    return {
      message: "Slug is already taken, please try another one",
      severity: "warning",
    };
  }

  const responseMessage = extractResponseMessage(error.response?.data);
  return {
    message: sanitizeMessage(
      responseMessage || error.message,
      defaultMessage
    ),
    severity: "error",
  };
}

function parseError(
  error: unknown,
  customMessage?: string,
  storeFront?: boolean
) {
  const { message, severity } = getErrorMessage(
    error,
    customMessage,
    storeFront
  );

  if (toast) {
    return severity === "warning" ? toast.warning(message) : toast.error(message);
  }
  // Server-side: log error instead
  console.error(message);
}

export default parseError;
