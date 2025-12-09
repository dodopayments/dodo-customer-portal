"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";
import parseError from "@/lib/serverParseError";

export async function fetchSubscriptions(
  pageNumber: number = 0,
  pageSize: number = 50
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch subscriptions");
    return { data: [], totalCount: 0, hasNext: false };
  }
}
