import { makeAuthenticatedRequest } from "@/lib/server-actions";
import parseError from "@/lib/parseError";

export async function fetchMeterEvents(
  meter_id: string,
  subscription_id: string,
  pageNumber: number = 0,
  pageSize: number = 50
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());
    params.set("start", new Date("2000-01-01").toISOString());
    params.set("end", new Date().toISOString());

    const response = await makeAuthenticatedRequest(
      `/customer-portal/subscriptions/${subscription_id}/meters/${meter_id}?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    parseError(error, "Failed to fetch events");
    return { data: [], totalCount: 0, hasNext: false };
  }
}
