"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/custom/InfoBox";
import { parseIsoDate } from "@/lib/date-helper";
import { cn } from "@/lib/utils";
import type { LicenseKeyStatus } from "@/app/session/entitlements/actions";

interface LicenseKeyFieldProps {
    licenseKey: string;
    expiresAt?: string | null;
    /** Absent until the API ships the field. Absent means treat the key as usable. */
    status?: LicenseKeyStatus;
}

/** Fixed-width mask, so the hidden field does not leak the key length. */
const KEY_MASK = "••••••••••••••••••••••••";

/**
 * Shows one license key with a reveal toggle and a copy button.
 *
 * Copy is the primary action here. The customer opens this sheet to paste the
 * key into the software the key unlocks.
 */
export function LicenseKeyField({
    licenseKey,
    expiresAt,
    status,
}: LicenseKeyFieldProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 1500);
        } catch {
            toast.error("Failed to copy the license key.");
        }
    };

    // The stored status can lag behind the date, so either one marks the key
    // as expired.
    const isPastExpiryDate = !!expiresAt && new Date(expiresAt) < new Date();
    const isExpired = status === "expired" || isPastExpiryDate;
    const isDisabled = status === "disabled";
    // Pair the date with "Expired" only once the date itself has passed. A key
    // the API already calls expired can still carry a future date, and
    // "Expired Aug 9, 27" on 19 Aug 26 reads as a contradiction.
    const showDate = !!expiresAt && (!isExpired || isPastExpiryDate);

    return (
        <div className="space-y-2">
            <span className="text-sm text-text-secondary">License Key</span>
            <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-2">
                <p
                    className={cn(
                        "flex-1 min-w-0 truncate font-mono text-sm",
                        isVisible ? "text-text-primary" : "text-text-secondary",
                    )}
                >
                    {isVisible ? licenseKey : KEY_MASK}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-text-secondary"
                    onClick={() => setIsVisible((current) => !current)}
                    aria-label={isVisible ? "Hide license key" : "Show license key"}
                >
                    {isVisible ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-text-secondary"
                    onClick={handleCopy}
                    aria-label="Copy license key"
                >
                    {hasCopied ? (
                        <Check className="w-4 h-4 text-text-success-primary" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </Button>
            </div>
            {(showDate || isExpired) && (
                <p
                    className={cn(
                        "text-xs",
                        isExpired ? "text-text-error-primary" : "text-text-secondary",
                    )}
                >
                    {isExpired ? "Expired" : "Expires"}
                    {showDate ? ` ${parseIsoDate(expiresAt)}` : ""}
                </p>
            )}
            {isDisabled && (
                <InfoBox
                    color="yellow"
                    message="This license key is disabled. New activations fail."
                />
            )}
        </div>
    );
}
