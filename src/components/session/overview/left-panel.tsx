"use client";

import Link from "next/link";
import Image from "next/image";


export function LeftPanel() {

    return (
        <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-bg-secondary border-r border-border-secondary p-8 sticky top-0 h-screen">
            <div className="flex-1">
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
