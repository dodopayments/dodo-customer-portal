"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBusiness } from "@/hooks/use-business";
import { usePathname } from "next/navigation";


export function LeftPanel() {
    const { business } = useBusiness();
    const pathname = usePathname();
    const isOverview = pathname === "/session/overview";
    const [returnUrl, setReturnUrl] = useState<string | null>(null);

    useEffect(() => {
        try {
            setReturnUrl(sessionStorage.getItem("return_url"));
        } catch {
            // sessionStorage unavailable (SSR, sandboxed iframe, privacy mode)
        }
    }, []);

    return (
        <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-bg-secondary border-r border-border-secondary p-8 sticky top-0 h-screen">
            <div className="flex-1">
                {isOverview ? (
                    returnUrl && (
                        <button
                            onClick={() => window.location.assign(returnUrl)}
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Go back to {business?.name || "Business"}</span>
                        </button>
                    )
                ) : (
                    <Link
                        href="/session/overview"
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Overview</span>
                    </Link>
                )}
                <h1 className="text-2xl font-display font-semibold text-text-primary leading-tight mb-4">
                    Manage your subscription and billing settings
                </h1>
                <p className="text-text-secondary text-sm leading-relaxed">
                    View payment history, download invoices, and manage subscriptions and payment methods.
                </p>
            </div>

            <div className="mt-auto pt-8 flex items-center gap-4 text-xs text-text-tertiary">
                <span className="flex items-center gap-1.5">
                    <span>Powered by</span>
                    <Link
                        href="https://dodopayments.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors font-medium"
                    >
                        <Image
                            src="/images/brand-assets/logo/logo.svg"
                            alt="Dodo Payments"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                        />
                        <span>Dodo Payments</span>
                    </Link>
                </span>
                <span className="text-text-tertiary">|</span>
                <Link href="https://dodopayments.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                    Privacy
                </Link>
                <Link href="https://dodopayments.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                    Terms
                </Link>
            </div>
        </aside>
    );
}
