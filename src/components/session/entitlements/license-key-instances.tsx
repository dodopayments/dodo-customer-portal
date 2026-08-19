"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import InfoBox from "@/components/custom/InfoBox";
import { parseIsoDate } from "@/lib/date-helper";
import {
    deactivateLicenseKeyInstance,
    fetchLicenseKeyInstances,
    type LicenseKeyInstance,
    type LicenseKeyInstancePage,
    type LicenseKeyStatus,
} from "@/app/session/entitlements/actions";

interface LicenseKeyInstancesProps {
    grantId: string;
    licenseKey: string;
    /** Absent and null both mean the entitlement sets no limit. */
    activationsLimit?: number | null;
    /** Absent until the API ships the field. Absent means treat the key as usable. */
    status?: LicenseKeyStatus;
}

/**
 * Names one instance.
 *
 * `name` is free text that the caller of `/licenses/activate` chooses, so it
 * can be a machine, a seat, a site, or anything else, and it collides often.
 * The id is on show because it is the only thing that tells two same-named
 * instances apart.
 */
function InstanceIdentity({ instance }: { instance: LicenseKeyInstance }) {
    return (
        <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
                {instance.name}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="truncate font-mono">{instance.id}</span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">{parseIsoDate(instance.created_at)}</span>
            </p>
        </div>
    );
}

function InstanceRowSkeleton() {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
            <div className="w-full space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-8 w-24 shrink-0" />
        </div>
    );
}

/**
 * Lists the instances activated against a license key and lets the customer
 * deactivate one.
 *
 * The component fetches on mount. The sheet that renders it unmounts on close,
 * so every open reads a fresh list.
 */
export function LicenseKeyInstances({
    grantId,
    licenseKey,
    activationsLimit,
    status,
}: LicenseKeyInstancesProps) {
    // The schema marks `activations_limit` optional, so it arrives absent as
    // well as null. Both mean the same thing: no limit.
    const limit = activationsLimit ?? null;
    const router = useRouter();
    const [instances, setInstances] = useState<LicenseKeyInstance[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoadFailed, setHasLoadFailed] = useState(false);
    const [pendingInstance, setPendingInstance] =
        useState<LicenseKeyInstance | null>(null);
    const [isDeactivating, setIsDeactivating] = useState(false);

    const applyPage = useCallback((page: LicenseKeyInstancePage | null) => {
        setIsLoading(false);
        setHasLoadFailed(page === null);
        if (page === null) return;
        setInstances(page.items);
        setHasMore(page.hasMore);
    }, []);

    useEffect(() => {
        let isActive = true;

        fetchLicenseKeyInstances(grantId).then((page) => {
            if (isActive) applyPage(page);
        });

        return () => {
            isActive = false;
        };
    }, [grantId, applyPage]);

    const handleRetry = async () => {
        setIsLoading(true);
        applyPage(await fetchLicenseKeyInstances(grantId));
    };

    const handleDeactivate = async () => {
        if (!pendingInstance) return;

        setIsDeactivating(true);
        const result = await deactivateLicenseKeyInstance(
            licenseKey,
            pendingInstance.id,
        );
        setIsDeactivating(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setInstances((current) =>
            current.filter((instance) => instance.id !== pendingInstance.id),
        );
        setPendingInstance(null);
        toast.success("Instance deactivated");
        router.refresh();
    };

    // The count comes from the listed instances, so it always matches the rows
    // on screen, including the moment after a local removal and before the
    // refresh lands. The grant's `activations_used` agrees with it: that field
    // is `license_keys.instances_count`, which activate increments and
    // deactivate decrements in the same transaction as the instance row.
    // A full page means the count is a floor, not a total.
    const isCountComplete = !hasMore;
    const hasCount = !isLoading && !hasLoadFailed;
    const countLabel = !isCountComplete
        ? `${instances.length}+`
        : limit === null
            ? String(instances.length)
            : `${instances.length} of ${limit}`;
    // The at-limit notice tells the customer to free a slot so they can activate
    // the key somewhere else. That advice is wrong when the key cannot activate
    // anything, so the field component states the real blocker instead.
    const canActivate = status === undefined || status === "active";
    const isAtLimit =
        hasCount &&
        isCountComplete &&
        canActivate &&
        limit !== null &&
        instances.length >= limit;
    const hasInstances = instances.length > 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Instances</span>
                {hasCount && (
                    <span className="text-sm text-text-primary">{countLabel}</span>
                )}
            </div>

            {isAtLimit && (
                <InfoBox
                    color="yellow"
                    message={`All ${limit} instances are in use. Deactivate one to activate this license key somewhere else.`}
                />
            )}

            {isLoading && (
                <div className="space-y-2">
                    <InstanceRowSkeleton />
                    <InstanceRowSkeleton />
                </div>
            )}

            {!isLoading && hasLoadFailed && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border-secondary px-3 py-3">
                    <p className="text-sm text-text-secondary">
                        Failed to load instances.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleRetry}>
                        Retry
                    </Button>
                </div>
            )}

            {!isLoading && !hasLoadFailed && !hasInstances && (
                <div className="rounded-lg border border-dashed border-border-secondary px-3 py-4">
                    <p className="text-sm text-text-secondary">
                        No instances yet. Each activation of this license key
                        appears here.
                    </p>
                </div>
            )}

            {!isLoading && !hasLoadFailed && hasInstances && (
                <div className="space-y-2">
                    {instances.map((instance) => (
                        <div
                            key={instance.id}
                            className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2"
                        >
                            <InstanceIdentity instance={instance} />
                            <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 hover:text-text-error-primary"
                                onClick={() => setPendingInstance(instance)}
                                aria-label={`Deactivate ${instance.name}`}
                            >
                                Deactivate
                            </Button>
                        </div>
                    ))}

                    {hasMore && (
                        <p className="text-xs text-text-secondary">
                            Showing the {instances.length} most recent instances.
                        </p>
                    )}
                </div>
            )}

            <Dialog
                open={!!pendingInstance}
                onOpenChange={(open) => {
                    if (!open && !isDeactivating) setPendingInstance(null);
                }}
            >
                <DialogContent className="max-w-[95vw] rounded-lg sm:max-w-[480px]">
                    <div className="space-y-2">
                        <DialogHeader className="mb-3 space-y-0">
                            <div className="bg-bg-error-secondary p-3 w-fit h-fit rounded-full text-border-error dark:text-[#FECDCA]">
                                <TriangleAlert className="w-6 h-6" />
                            </div>
                            <DialogTitle className="pt-4">
                                Deactivate this instance?
                            </DialogTitle>
                            <DialogDescription>
                                This instance loses access to this license key. You
                                cannot undo this here. Activate the license key again
                                to restore access.
                            </DialogDescription>
                        </DialogHeader>
                        {pendingInstance && (
                            <div className="rounded-lg border bg-card px-3 py-2">
                                <InstanceIdentity instance={pendingInstance} />
                            </div>
                        )}
                        <DialogFooter className="gap-2 flex flex-row pt-4 w-full sm:gap-0">
                            <DialogClose asChild>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    disabled={isDeactivating}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleDeactivate}
                                disabled={isDeactivating}
                            >
                                {isDeactivating ? "Deactivating" : "Deactivate"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
