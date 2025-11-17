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

function getToast() {
  // Only use toast in client context
  if (typeof window === "undefined") {
    return null;
  }
  
  try {
    // Use dynamic require to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { toast } = require("sonner");
    // Verify toast has the methods we need
    if (toast && typeof toast.error === "function" && typeof toast.warning === "function") {
      return toast;
    }
    return null;
  } catch {
    return null;
  }
}

function parseError(
  error: unknown,
  customMessage?: string,
  storeFront?: boolean
) {
  const defaultMessage = customMessage || "Something went wrong";
  const toast = getToast();

  if (!isErrorDetails(error)) {
    const fallback = error instanceof Error ? error.message : undefined;
    const message = sanitizeMessage(fallback, defaultMessage);
    if (toast) {
      return toast.error(message);
    }
    // Server-side: log error instead
    console.error(message);
    return;
  }

  const status = error.status ?? error.response?.status;

  if (status === 401 || status === 403) {
    const message = "You are not authorized to perform this action";
    if (toast) {
      return toast.warning(message);
    }
    console.error(message);
    return;
  }

  if (storeFront && status === 409) {
    const message = "Slug is already taken, please try another one";
    if (toast) {
      return toast.warning(message);
    }
    console.error(message);
    return;
  }

  const responseMessage = extractResponseMessage(error.response?.data);
  const message = sanitizeMessage(responseMessage || error.message, defaultMessage);
  
  if (toast) {
    return toast.error(message);
  }
  // Server-side: log error instead
  console.error(message);
}

export default parseError;
