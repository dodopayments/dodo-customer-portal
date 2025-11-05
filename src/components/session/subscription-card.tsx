"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubscriptionData } from "./subscriptions/subscriptions";
import { Badge, type BadgeVariant } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { useRouter } from "next/navigation";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";
import { renderSubscriptionBadges } from "./subscription-utils";
import ProductMarkdownDescription from "../common/product-markdown-description";

interface SubscriptionCardProps {
  item: SubscriptionData;
  cardClassName?: string;
}

export const SubscriptionCard = ({
  item,
  cardClassName,
}: SubscriptionCardProps) => {
  const router = useRouter();
  return (
    <Card className={cardClassName}>
      <CardContent className="flex flex-row items-start px-0 gap-4">
        <Image
          src={item.product.image}
          alt={item.product.name}
          width={64}
          height={64}
          className="rounded-lg flex-none aspect-square object-cover"
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-row justify-between items-start gap-4">
            <div className="flex flex-row gap-2">
              <CardTitle className="font-display font-semibold text-base leading-5 flex-none">
                {item.product.name}
              </CardTitle>
              <Badge
                variant={getBadge(item.status).color as BadgeVariant}
                dot={false}
                className="rounded-sm border-sm"
              >
                {getBadge(item.status).message}
              </Badge>
            </div>
            <div className="font-display font-semibold text-base leading-5 flex-none">
              {formatCurrency(
                item.recurring_pre_tax_amount,
                item.currency as CurrencyCode,
              )}
            </div>
          </div>
          <CardDescription className="font-body font-normal text-sm pt-4 leading-[21px] text-text-secondary self-stretch">
            <ProductMarkdownDescription description={item.product.description} />
          </CardDescription>
        </div>
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="flex flex-row justify-between p-0">
        <Button
          variant="secondary"
          onClick={() =>
            router.push(`/session/subscriptions/${item.subscription_id}`)
          }
        >
          View details
        </Button>
        <div className="flex flex-row gap-2">
          {renderSubscriptionBadges(item, "rounded-sm border-sm")}
        </div>
      </CardFooter>
    </Card>
  );
};
