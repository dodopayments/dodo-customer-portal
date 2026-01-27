"use client";

import { ReactNode } from "react";
import PlausibleProvider from "next-plausible";

export function CSPlausibleProvider({ children }: { children: ReactNode }) {
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const plausibleApiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST;

    if (!plausibleDomain) {
        return <>{children}</>;
    }

    return (
        <PlausibleProvider
            domain={plausibleDomain}
            customDomain={plausibleApiHost}
        >
            {children}
        </PlausibleProvider>
    );
}