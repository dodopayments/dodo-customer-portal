/**
 * An archived business rejects every end-customer request, but not in one
 * shape. Portal login and the unified token mint answer 403 with JSON
 * `{ code: "BUSINESS_ARCHIVED" }`; the token extractor that guards every other
 * portal route answers 403 with a bare string. Both are terminal.
 */

export const BUSINESS_ARCHIVED_CODE = "BUSINESS_ARCHIVED";

/** Route a customer lands on once the merchant has archived the business. */
export const BUSINESS_ARCHIVED_ROUTE = "/unavailable";

const ARCHIVED_TEXT = "this business is archived";

/** The extractor also answers 503 in plain text when the lookup fails. */
const LOOKUP_FAILED_TEXT = "business lookup failed";

function mentionsArchived(body: unknown): boolean {
  if (typeof body === "string") {
    return body.toLowerCase().includes(ARCHIVED_TEXT);
  }
  if (body && typeof body === "object") {
    return (body as { code?: unknown }).code === BUSINESS_ARCHIVED_CODE;
  }
  return false;
}

/** True when a 403 means the merchant archived the business. */
export function isBusinessArchived(
  status: number | undefined,
  body: unknown
): boolean {
  return status === 403 && mentionsArchived(body);
}

/**
 * True only for the extractor's plain-text 503, which is transient. Every other
 * 503 keeps whatever message the API sent, so this cannot relabel an unrelated
 * outage as a store problem.
 */
export function isBusinessLookupFailure(
  status: number | undefined,
  body: unknown
): boolean {
  if (status !== 503 || typeof body !== "string") return false;
  return body.toLowerCase().includes(LOOKUP_FAILED_TEXT);
}

/**
 * Reads a fetch Response without assuming JSON: the extractor's 403 and 503
 * are plain text, so `response.json()` would throw on the exact paths that
 * matter most.
 */
export async function readResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
