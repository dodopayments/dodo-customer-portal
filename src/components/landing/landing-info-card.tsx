import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const LandingInfoCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("max-w-2xl bg-bg-secondary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm">What is Dodo Payments?</CardTitle>
      </CardHeader>
      <CardContent className="text-text-secondary leading-relaxed">
        <p className="mb-1 text-xs sm:text-sm">
          Dodo Payments is a Merchant of Record (MoR) platform that manages payments, tax compliance, and billing infrastructure for a growing number of digital businesses, including software products, tools, and services. When you make a purchase or subscribe to a product sold by one of these businesses, it&apos;s Dodo Payments that handles the transaction, billing, customer support, refunds and disputes.
          <br className="hidden sm:block" />
          Visit <Link href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" className="hover:underline">dodopayments.com</Link> to learn more.
        </p>
      </CardContent>
    </Card>
  );
};
