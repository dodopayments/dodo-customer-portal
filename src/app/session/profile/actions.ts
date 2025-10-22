"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";

export interface UserResponse {
  business_id: string;
  created_at: string;
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
}

export async function fetchUser(): Promise<UserResponse> {
  const response = await makeAuthenticatedRequest('/customer-portal/profile');

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}
