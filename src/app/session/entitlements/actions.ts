"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
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

export interface LicenseKeyGrant {
  key: string;
  expires_at: string | null;
  activations_used: number;
  activations_limit: number | null;
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
  error?: GrantErrorInfo | null;
}

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
    console.log(data);
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
    console.log(`Downloading entitlement grant ${grantId}`);
    const response = await makeAuthenticatedRequest(
      `/customer-portal/entitlements/${grantId}/download`
    );
    console.log(`Response: ${response.status}`);
    if (!response.ok) {
      throw new Error(`Failed to get download url: ${response.status}`);
    }

    return (await response.json()) as DownloadResponse;
  } catch (error) {
    parseError(error, "Failed to get download URL");
    return null;
  }
}
