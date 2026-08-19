"use server";

import { getToken, makeAuthenticatedRequest } from "@/lib/server-actions";
import { ssrProxyFetch } from "@/lib/ssr-proxy";
import parseError from "@/lib/serverErrorHelper";

export interface EntitlementSummary {
  name: string;
  integration_type: string;
  description?: string | null;
}

export type EntitlementGrantStatus = "Pending" | "Delivered" | "Failed" | "Revoked";

export type PortalGrantActionType = "oauth" | "telegram_connect" | "none";

export interface GrantErrorInfo {
  code: string;
  message: string;
}

export interface DownloadFile {
  file_id: string;
  download_url: string;
  filename: string;
  expires_in: number;
  content_type?: string | null;
  file_size?: number | null;
}

export interface DownloadResponse {
  files: DownloadFile[];
  external_link?: string | null;
  instructions?: string | null;
}

/** The state of the key itself, which is separate from the grant status. */
export type LicenseKeyStatus = "active" | "expired" | "disabled";

export interface LicenseKeyGrant {
  key: string;
  activations_used: number;
  /** Absent until the API ships the field, so treat it as unknown. */
  id?: string;
  /** Absent until the API ships the field. Absent means treat the key as usable. */
  status?: LicenseKeyStatus;
  /** Optional per the schema: absent, null, or a number. */
  expires_at?: string | null;
  /** Optional per the schema: absent, null, or a number. Absent means no limit. */
  activations_limit?: number | null;
}

export interface DigitalProductDeliveryFile {
  file_id: string;
  download_url: string;
  filename: string;
  expires_in: number;
  content_type: string | null;
  file_size: number | null;
}

export interface DigitalProductDelivery {
  files: DigitalProductDeliveryFile[];
  instructions: string | null;
  external_url: string | null;
}

export interface FramerDelivery {
  remix_link: string;
  template_name?: string | null;
}

export interface PortalGrantResponse {
  id: string;
  entitlement: EntitlementSummary;
  status: EntitlementGrantStatus;
  requires_action: boolean;
  action_type: PortalGrantActionType;
  created_at: string;
  updated_at: string;
  delivered_at?: string | null;
  oauth_expires_at?: string | null;
  oauth_url?: string | null;
  license_key: LicenseKeyGrant | null;
  digital_product_delivery: DigitalProductDelivery | null;
  framer_delivery: FramerDelivery | null;
  error?: GrantErrorInfo | null;
}

export interface LicenseKeyInstance {
  id: string;
  business_id: string;
  name: string;
  license_key_id: string;
  created_at: string;
}

export interface LicenseKeyInstancePage {
  items: LicenseKeyInstance[];
  /** True when the response filled the page, so more instances exist. */
  hasMore: boolean;
}

export type DeactivateInstanceResult =
  | { success: true }
  | { success: false; error: string };

export interface AcceptResponse {
  status: EntitlementGrantStatus;
  oauth_url?: string | null;
  oauth_expires_at?: string | null;
}

export interface AcceptRequest {
  return_to?: string | null;
  metadata?: Record<string, string> | null;
  telegram_user_id?: string | null;
}

export async function fetchPortalEntitlements(): Promise<PortalGrantResponse[]> {
  try {
    const response = await makeAuthenticatedRequest("/customer-portal/entitlements");

    if (!response.ok) {
      throw new Error(`Failed to fetch entitlements: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    parseError(error, "Failed to fetch entitlements");
    return [];
  }
}

export async function acceptEntitlementGrant(
  grantId: string,
  body: AcceptRequest = {},
): Promise<AcceptResponse | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/entitlements/${grantId}/accept`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to accept entitlement: ${response.status}`);
    }

    return (await response.json()) as AcceptResponse;
  } catch (error) {
    parseError(error, "Failed to accept entitlement");
    return null;
  }
}

export async function reconnectEntitlementGrant(
  grantId: string,
): Promise<AcceptResponse | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/entitlements/${grantId}/reconnect`,
      { method: "POST" },
    );

    if (!response.ok) {
      throw new Error(`Failed to reconnect entitlement: ${response.status}`);
    }

    return (await response.json()) as AcceptResponse;
  } catch (error) {
    parseError(error, "Failed to reconnect entitlement");
    return null;
  }
}

export async function downloadEntitlementGrant(
  grantId: string
): Promise<DownloadResponse | null> {
  try {
    const response = await makeAuthenticatedRequest(
      `/customer-portal/entitlements/${grantId}/download`
    );
    if (!response.ok) {
      throw new Error(`Failed to get download url: ${response.status}`);
    }

    return (await response.json()) as DownloadResponse;
  } catch (error) {
    parseError(error, "Failed to get download URL");
    return null;
  }
}

/** The endpoint caps page_size at 100. */
const INSTANCE_PAGE_SIZE = 100;

/**
 * Lists the instances activated against one license-key grant, newest first.
 *
 * Returns null when the request fails. The caller uses that to tell a load
 * failure apart from a grant that has no instances yet.
 */
export async function fetchLicenseKeyInstances(
  grantId: string,
): Promise<LicenseKeyInstancePage | null> {
  try {
    const params = new URLSearchParams({
      grant_id: grantId,
      page_size: String(INSTANCE_PAGE_SIZE),
    });

    const response = await makeAuthenticatedRequest(
      `/customer-portal/license-key-instances?${params}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch license key instances: ${response.status}`,
      );
    }

    const data = await response.json();
    const items: LicenseKeyInstance[] = data.items || [];

    return {
      items: items
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      hasMore: items.length >= INSTANCE_PAGE_SIZE,
    };
  } catch (error) {
    parseError(error, "Failed to fetch license key instances");
    return null;
  }
}

function deactivateErrorMessage(status: number): string {
  if (status === 403) {
    return "This instance is no longer linked to this license key.";
  }
  if (status === 404) {
    return "This license key no longer exists.";
  }
  return "Failed to deactivate the instance. Please try again.";
}

/**
 * Deactivates one instance of a license key.
 *
 * The customer-portal API has no deactivate endpoint, so this targets
 * `/licenses/deactivate` on the same backend, without the `/customer-portal/`
 * prefix. It still goes through the SSR proxy, like every other server-side
 * call. That endpoint declares no security scheme and identifies the key by
 * its string, so no portal token is sent. The action still requires a portal
 * session, which stops the browser from using it as an open relay.
 */
export async function deactivateLicenseKeyInstance(
  licenseKey: string,
  instanceId: string,
): Promise<DeactivateInstanceResult> {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, error: "Your session expired. Sign in again." };
    }

    const response = await ssrProxyFetch({
      path: "/licenses/deactivate",
      method: "POST",
      cache: "no-store",
      body: {
        license_key: licenseKey,
        license_key_instance_id: instanceId,
      },
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const message = deactivateErrorMessage(response.status);
      parseError(
        new Error(
          `Failed to deactivate license key instance: ${response.status} ${detail}`,
        ),
        message,
      );
      return { success: false, error: message };
    }

    return { success: true };
  } catch (error) {
    const message = "Failed to deactivate the instance. Please try again.";
    parseError(error, message);
    return { success: false, error: message };
  }
}
