import { SubscriptionResponse } from "@/types/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function SubscriptionDetails({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-3 p-6 flex flex-col gap-4">
                    <CardHeader className="flex flex-col gap-2 p-0">
                        <p className="text-text-secondary text-sm">Plan Name</p>
                        <CardTitle>$30.00/month</CardTitle>
                        <CardDescription className="text-text-secondary text-sm">Example product description</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row gap-2 p-0">
                        <Badge variant="default" dot={false} className="rounded-sm border-sm">
                            renews on 20/11/2025
                        </Badge>
                        <Badge variant="default" dot={false} className="rounded-sm border-sm">
                            valid until 20/11/2025
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