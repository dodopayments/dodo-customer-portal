"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/hooks/use-business";
import { useEffect } from "react";
import { tokenHelper } from "@/lib/token-helper";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import ThemeSwitch from "../ui/dodo/ThemeSwitch";

const BusinessName = ({
    image,
    name,
    hide,
}: {
    image?: string;
    name: string;
    hide?: boolean;
}) => {
    return (
        <div className="flex items-center gap-2">
            {image ? (
                <Avatar className="w-7 h-7 aspect-square">
                    <AvatarImage src={image} />
                    <AvatarFallback className="text-xs" name={name} />
                </Avatar>
            ) : (
                <div className="object-cover object-center bg-bg-secondary w-8 h-8 aspect-square" />
            )}
            <span
                className={cn(
                    "text-text-primary font-hanken font-semibold text-[22.22px] leading-[29.92px] tracking-normal",
                    hide && "md:block hidden"
                )}
                style={{ leadingTrim: 'cap-height' } as React.CSSProperties}
            >
                {name}
            </span>
        </div>
    );
};


export function AppSidebar() {
    const { business: businessData } = useBusiness();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (businessData?.name) {
            document.title = `${businessData.name} - DodoPayments`;
        }
    }, [businessData?.name]);

    const handleLogout = () => {
        try {
            const businessId = businessData?.business_id;
            tokenHelper.logout();
            router.push(`/login/${businessId}`);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navigation = [
        { label: 'Orders', path: '/session/orders', activeCheck: ['/session/orders', '/session/subscriptions'] },
        { label: 'Payment Methods', path: '/session/payment-methods' },
        { label: 'Profile & Wallets', path: '/session/profile' },
    ];

    return (
        <Sidebar className="p-6 px-4 border-none">
            <SidebarHeader>
                <BusinessName
                    image={businessData?.logo}
                    name={businessData?.name ?? ""}
                    hide={false}
                />
            </SidebarHeader>
            <SidebarContent className="text-left mt-5">
                <SidebarGroup className="text-left gap-2">
                    {navigation.map(({ label, path, activeCheck }) => {
                        const isActive = activeCheck
                            ? activeCheck.some(check => pathname.includes(check))
                            : pathname.includes(path);

                        return (
                            <Button
                                key={path}
                                align="left"
                                variant={isActive ? 'secondary' : 'ghost'}
                                className="text-left text-text-secondary font-display font-normal text-sm leading-5 tracking-normal"
                                style={{ leadingTrim: 'cap-height' } as React.CSSProperties}
                                onClick={() => router.push(path)}
                            >
                                {label}
                            </Button>
                        );
                    })}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="self-stretch">
                <Link href="https://dodopayments.com" target="_blank" className="flex flex-row items-center gap-1.5 w-[165px] h-4 mb-2 mx-auto">
                    <Image
                        src="/images/brand-assets/logo/logo.svg"
                        alt="logo"
                        width={16}
                        height={16}
                    />
                    <p className="font-hanken font-medium text-xs leading-5 tracking-[-0.03em] text-primary" style={{ leadingTrim: 'both', textEdge: 'cap' } as React.CSSProperties}>
                        Powered by Dodo Payments
                    </p>
                </Link>
                <Separator />
                <div className="flex flex-row items-center justify-center gap-2">
                    <ThemeSwitch />
                    <Button variant={'secondary'} className="text-left w-full" onClick={handleLogout}>Log out</Button>

                </div>
            </SidebarFooter>
        </Sidebar>
    )
}   