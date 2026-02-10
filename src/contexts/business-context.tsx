"use client";

import React, { createContext, useContext } from "react";

interface Business {
    business_id: string;
    name: string;
    logo?: string;
    support_url?: string;
    [key: string]: any;
}

interface BusinessContextValue {
    business: Business | null;
    loading: boolean;
    error: string | null;
    hasBusinessToken: boolean;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

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
