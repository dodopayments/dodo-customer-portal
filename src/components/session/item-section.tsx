"use client";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

interface OneTimeData {   
    payment_id: string;
    status: string;
    total_amount: number;
    currency: string;
    payment_method: string | null;
    payment_method_type: string | null;
    created_at: string;
    digital_products_delivered: boolean;
    metadata: object;
}

interface SubscriptionData {
    subscription_id: string;
    recurring_pre_tax_amount: number;
    tax_inclusive: boolean;
    currency: string;
    status: string;
    created_at: string;
    product_id: string;
    quantity: number;
    trial_period_days: number;
    subscription_period_interval: string;
    payment_frequency_interval: string;
    subscription_period_count: number;
    payment_frequency_count: number;
    next_billing_date: string;
    previous_billing_date: string;
    customer: object;
    tax_id: string | null;
    metadata: object;
    discount_id: string | null;
    discount_cycles_remaining: number | null;
    cancelled_at: string | null;
    cancel_at_next_billing_date: boolean;
    billing: object;
    on_demand: boolean;
}

interface ItemCardProps {
    cardClassName?: string;
    imageUrl: string;
    title: string;
    description: string;
    amount: string;
    searchPlaceholder?: string;
    orderType: string;
    data: SubscriptionData[] | OneTimeData[];
}

export const ItemSection = ({ cardClassName, imageUrl, title, description, amount, searchPlaceholder, orderType }: ItemCardProps) => {
    const [search, setSearch] = useState("");
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary border-border-secondary" />
                    <Input type="text" placeholder={searchPlaceholder} className="pl-10 border-border-secondary" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <Card className={cn("border-b mt-6", cardClassName)}>
                <CardContent className="flex flex-row items-center px-0 gap-2">
                    <Image src={imageUrl} alt={title} width={56} height={56} className="rounded-lg flex-none aspect-square object-cover" />
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-row justify-between items-start gap-4">
                            <CardTitle className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{title}</CardTitle>
                            <CardDescription className="font-['Hanken_Grotesk'] font-semibold text-base leading-5 flex-none">{amount}</CardDescription>
                        </div>
                        <p className="font-['Inter'] font-normal text-sm leading-[21px] text-text-secondary self-stretch">{description}</p>
                    </div>
                </CardContent>
                <Separator className="mb-4" />
                <CardFooter className="flex flex-row justify-between p-0">
                    <div className="flex flex-row gap-2">
                        <Button variant="secondary" className="w-full">
                            <Key />
                            View details
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <Key />
                            View details
                        </Button>
                    </div>
                    <Badge variant="green" dot={false} className="rounded-sm border-sm">
                        Paid
                    </Badge>
                </CardFooter>
            </Card >
        </>
    )
}