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
          Dodo Payments is a software reseller who partners with thousands of software companies worldwide to resell their digital products.
          <br className="hidden sm:block" />
          Visit <Link href="https://dodopayments.com" target="_blank" rel="noopener noreferrer" className="hover:underline">dodopayments.com</Link> to learn more.
        </p>
      </CardContent>
    </Card>
  );
};
