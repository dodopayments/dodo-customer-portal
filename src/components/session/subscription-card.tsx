"use client";

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubscriptionData } from "./subscriptions/subscriptions";
import { Badge } from "../ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { useRouter } from "next/navigation";
import { CurrencyCode, formatCurrency } from "@/lib/currency-helper";

interface SubscriptionCardProps {
    item: SubscriptionData;
    cardClassName?: string;
}

export const SubscriptionCard = ({ item, cardClassName }: SubscriptionCardProps) => {
    const router = useRouter();
    return (
        <Card className={cardClassName}>
            <CardContent className="flex flex-row items-center px-0 gap-2">
                <Image src={item.product.image} alt={item.product.name} width={56} height={56} className="rounded-lg flex-none aspect-square object-cover" />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-row justify-between items-start gap-4">
                        <div className="flex flex-row gap-2">
                            <CardTitle className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{item.product.name}</CardTitle>
                            <Badge variant={getBadge(item.status).color as any} dot={false} className="rounded-sm border-sm">
                                {getBadge(item.status).message}
                            </Badge>
                        </div>
                        <div className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{formatCurrency(item.recurring_pre_tax_amount, item.currency as CurrencyCode)}</div>
                    </div>
                    <CardDescription className="font-['Inter'] font-normal text-sm leading-[21px] text-text-secondary self-stretch">{item.product.description}</CardDescription>
                </div>
            </CardContent>
            <Separator className="mb-4" />
            <CardFooter className="flex flex-row justify-between p-0">
                <Button variant="secondary" onClick={() => router.push(`/session/subscriptions/${item.subscription_id}`)}>
                    View details
                </Button>
                <div className="flex flex-row gap-2">
                    <Badge variant="default" dot={false} className="rounded-sm border-sm">
                        renews on {new Date(item.next_billing_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                        })}
                    </Badge>
                    <Badge variant="default" dot={false} className="rounded-sm border-sm">
                        valid until {new Date(item.next_billing_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                        })}
                    </Badge>
                </div>
            </CardFooter>
        </Card>
    );
};
