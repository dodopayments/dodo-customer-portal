import { toast } from "sonner";

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

function parseError(
  error: unknown,
  customMessage?: string,
  storeFront?: boolean
) {
  const defaultMessage = customMessage || "Something went wrong";

  if (!isErrorDetails(error)) {
    const fallback = error instanceof Error ? error.message : undefined;
    return toast.error(sanitizeMessage(fallback, defaultMessage));
  }

  const status = error.status ?? error.response?.status;

  if (status === 401 || status === 403) {
    return toast.warning("You are not authorized to perform this action");
  }

  if (storeFront && status === 409) {
    return toast.warning("Slug is already taken, please try another one");
  }

  const responseMessage = extractResponseMessage(error.response?.data);
  const message = responseMessage || error.message;

  return toast.error(sanitizeMessage(message, defaultMessage));
}

export default parseError;
