"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ArrowCounterClockwise, DownloadSimple, Question,Eye, ReceiptX } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Action {
  name: string;
  icon: React.ReactNode;
}

export const LandingCard = ({ className }: { className?: string }) => {
  const actions: Action[] = [
    {
      name: "Request Refund",
      icon: <ArrowCounterClockwise />,
    },
    {
      name: "Cancel subscription",
      icon: <ReceiptX />,
    },
    {
      name: "Download invoices",
      icon: <DownloadSimple />,
    },
    {
      name: "View orders processed through Dodo Payments",
      icon: <Eye />,
    },
    {
      name: "Other queries",
      icon: <Question />,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="max-w-2xl p-2">
        <CardHeader className="pb-6 sm:pb-10">
          <CardTitle className="text-lg sm:text-xl">What can we help you with today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border border-border-secondary p-3 sm:p-4">
            <div className="border-b border-border-secondary pb-4">
              <p className="text-sm sm:text-base">You can do the following actions:</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 flex-wrap">
              {actions.map((action) => (
                <div
                  key={action.name}
                  className="flex flex-row gap-2 items-center text-text-secondary w-fit"
                >
                  {action.icon}
                  <p className="text-sm sm:text-base">{action.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
            <Button className="w-full text-sm sm:text-base">Look up my purchase</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
