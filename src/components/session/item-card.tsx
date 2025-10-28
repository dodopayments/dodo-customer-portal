"use client";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key } from "lucide-react";

interface ItemCardProps {
    className?: string;
    imageUrl: string;
    title: string;
    description: string;
    amount: string;
}

export const ItemCard = ({ className, imageUrl, title, description, amount }: ItemCardProps) => {
    return (
        <Card className={cn("border-b", className)}>
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
    )
}