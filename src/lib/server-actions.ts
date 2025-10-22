import { cookies } from "next/headers";
import { api_url } from "./http";

export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('session_token')?.value || null;
  } catch {
    return null;
  }
}

export async function makeAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  return fetch(`${api_url}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  hasNext: boolean;
}

export interface FilterParams {
  pageSize?: number;
  pageNumber?: number;
  created_at_gte?: string;
  created_at_lte?: string;
  status?: string;
}
