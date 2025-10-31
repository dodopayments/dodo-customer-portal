
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { parseIsoDate } from "@/lib/date-helper";
import { CurrencyCode, formatCurrency, decodeCurrency } from "@/lib/currency-helper";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";

export function SubscriptionDetails({ subscription }: { subscription: SubscriptionDetailsData }) {
    console.log("subscription", subscription);
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-3 p-6 flex flex-col gap-4">
                    <CardHeader className="flex flex-col gap-2 p-0">
                        <p className="text-text-secondary text-sm">{subscription.product.name}</p>
                        <CardTitle>{formatCurrency(decodeCurrency(subscription.recurring_pre_tax_amount, subscription.currency as CurrencyCode), subscription.currency as CurrencyCode)}/{subscription.payment_frequency_interval.toLowerCase()}</CardTitle>
                        <CardDescription className="text-text-secondary text-sm">{subscription.product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row gap-2 p-0">
                        <Badge variant="default" dot={false} className="rounded-sm border-sm">
                            renews on {parseIsoDate(subscription.next_billing_date)}
                        </Badge>
                        <Badge variant="default" dot={false} className="rounded-sm border-sm">
                            valid until {parseIsoDate(subscription.next_billing_date)}
                        </Badge>
                    </CardContent>

                </Card>
                <Card className="col-span-1 p-6 flex flex-col gap-4">
                    <CardHeader className="flex flex-col gap-2 p-0">
                        <p className="text-sm">Payment Method</p>
                        <Separator />
                    </CardHeader>
                </Card>

            </div>
        </div>

    );
}