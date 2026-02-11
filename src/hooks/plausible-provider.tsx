"use client";

import PlausibleProvider from "next-plausible";

export function CSPlausibleProvider() {
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const plausibleApiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST;

    if (!plausibleDomain) {
        return null;
    }

    return (
        <PlausibleProvider
            domain={plausibleDomain}
            customDomain={plausibleApiHost}
        />
    );
}