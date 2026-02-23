"use client";

import React, { createContext, useContext } from "react";
export interface CustomerBusinessTrackingDetails {
    /** Google Analytics 4 Measurement ID (G-XXXXXXXXXX) */
    google_analytics_id?: string | null;
    /** Google Tag Manager container ID (GTM-XXXXXXX) */
    google_tag_manager_id?: string | null;
    /** Meta (Facebook) Pixel ID */
    meta_pixel_id?: string | null;
}
export interface Business {
    /** if null assume false */
    allow_customer_portal_sub_change_plan?: boolean | null;
    business_id: string;
    country?: null | string;
    description?: string | null;
    logo: string;
    name?: string | null;
    support_email?: string | null;
    /** Tracking configuration for analytics integration */
    tracking?: null | CustomerBusinessTrackingDetails;
}

interface BusinessContextValue {
    business: Business | null;
    loading: boolean;
    error: string | null;
    hasBusinessToken: boolean;
}

export const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

interface BusinessProviderProps {
    children: React.ReactNode;
    initialBusiness: Business | null;
    hasBusinessToken?: boolean;
}

/**
 * Provides business-related data and state through context.
 */
export function BusinessProvider({ children, initialBusiness, hasBusinessToken = false }: BusinessProviderProps) {
    const value: BusinessContextValue = {
        business: initialBusiness,
        loading: false,
        error: initialBusiness === null ? "Failed to load business data" : null,
        hasBusinessToken,
    };

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    );
}

/**
 * Access business data from the BusinessProvider context.
 */
export function useBusiness(): BusinessContextValue {
    const context = useContext(BusinessContext);

    if (context === undefined) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }

    return context;
}
