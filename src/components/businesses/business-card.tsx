"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { BusinessData } from "./businesses";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/http";
import { getBusinessToken } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function BusinessCard({ business }: { business: BusinessData }) {
  const router = useRouter();
  async function getBusinessDetails(businessId: string) {
    try {
      const token = await getBusinessToken();
      const response = await api.get(
        `/unified-customer-portal/businesses/${businessId}/customer-portal-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch business details: ${response.status}`);
      }
      const data = response.data;
      router.push(`/session/${data.token}`);
    } catch (error) {
      console.error("Failed to fetch business details:", error);
      toast.error("Failed to fetch business details");
    }
  }

  return (
    <Card className="w-full">
      <div className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center justify-center gap-2">
          <Avatar className="w-8 h-8 aspect-square">
            <AvatarImage src={business.logo} />
            <AvatarFallback name={business.name} />
          </Avatar>
          <CardTitle className="text-lg font-display">
            {business.name}
          </CardTitle>
        </div>
        <Button
          variant="secondary"
          onClick={() => getBusinessDetails(business.business_id)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
