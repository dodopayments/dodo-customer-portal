"use server";

import { makeAuthenticatedBusinessRequest } from "@/lib/server-actions";
import parseError from "@/lib/serverErrorHelper";

export async function fetchBusinesses(
  pageNumber: number = 0,
  pageSize: number = 50
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedBusinessRequest(
      `/unified-customer-portal/businesses?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch businesses: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch businesses");
    return { data: [], totalCount: 0, hasNext: false };
  }
}
