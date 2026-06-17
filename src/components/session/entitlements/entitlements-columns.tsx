"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TimeTooltip } from "@/components/custom/time-tooltip";
import { parseIsoDate } from "@/lib/date-helper";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    type PortalGrantResponse,
    reconnectEntitlementGrant,
    acceptEntitlementGrant,
} from "@/app/session/entitlements/actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Download, Loader2, ExternalLink, KeyRound, FileMinus, Info } from "lucide-react";
import { Mode } from "@/lib/http";

export interface EntitlementRow {
    id: string;
    name: string;
    type: string;
    date_accessed: string;
    status: "active" | "inactive";
    raw: PortalGrantResponse;
}

const TYPE_LABELS: Record<string, string> = {
    discord: "Discord Access",
    github: "GitHub Access",
    figma: "Figma Template",
    notion: "Notion Template",
    telegram: "Telegram Access",
    framer: "Framer Template",
    digital_files: "Digital Product Delivery",
    license_key: "License Key",
};

function statusBadgeVariant(status: PortalGrantResponse["status"]): BadgeVariant {
    switch (status) {
        case "Delivered":
            return "green";
        case "Pending":
            return "yellow";
        case "Failed":
            return "red";
        case "Revoked":
            return "default";
        default:
            return "default";
    }
}

function ActionCell({ raw }: { raw: PortalGrantResponse }) {
    const router = useRouter();
    const [viewOpen, setViewOpen] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const [telegramOpen, setTelegramOpen] = useState(false);
    const [telegramUserId, setTelegramUserId] = useState("");
    const [telegramSubmitting, setTelegramSubmitting] = useState(false);
    const [notionOpen, setNotionOpen] = useState(false);

    const isNotion = raw.entitlement.integration_type === "notion";

    const handleOAuthConnect = async () => {
        setConnecting(true);
        const res = await acceptEntitlementGrant(raw.id, {
            return_to: typeof window !== "undefined" ? window.location.href : undefined,
        });
        setConnecting(false);
        if (res?.oauth_url) {
            window.open(res.oauth_url, "_blank", "noopener,noreferrer");
            router.refresh();
        } else {
            toast.error("No authorization URL returned");
        }
    };

    const handleTelegramSubmit = async () => {
        const trimmed = telegramUserId.trim();
        if (!trimmed) {
            toast.error("Telegram user ID is required");
            return;
        }
        setTelegramSubmitting(true);
        const res = await acceptEntitlementGrant(raw.id, {
            telegram_user_id: trimmed,
        });
        setTelegramSubmitting(false);
        if (res) {
            toast.success("Telegram account linked");
            setTelegramOpen(false);
            setTelegramUserId("");
            router.refresh();
        } else {
            toast.error("Failed to link Telegram account");
        }
    };

    const handleReconnect = async () => {
        setReconnecting(true);
        const res = await reconnectEntitlementGrant(raw.id);
        setReconnecting(false);
        if (res?.oauth_url) {
            window.open(res.oauth_url, "_blank", "noopener,noreferrer");
            router.refresh();
        } else if (res) {
            toast.success("Reconnected successfully");
            router.refresh();
        } else {
            toast.error("Failed to reconnect");
        }
    };

    const isPendingOAuth =
        raw.status === "Pending" && raw.requires_action && raw.action_type === "oauth";
    const isPendingTelegram =
        raw.status === "Pending" && raw.requires_action && raw.action_type === "telegram_connect";
    const isExpiredOAuth =
        raw.status === "Delivered" && raw.oauth_expires_at && new Date(raw.oauth_expires_at) < new Date();

    return (
        <>
            <div className="flex justify-end gap-2">
                {isPendingOAuth && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={isNotion ? () => setNotionOpen(true) : handleOAuthConnect}
                        disabled={connecting}
                    >
                        {connecting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        ) : (
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Connect
                    </Button>
                )}

                {isPendingTelegram && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTelegramOpen(true)}
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Connect
                    </Button>
                )}

                {isExpiredOAuth && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReconnect}
                        disabled={reconnecting}
                    >
                        {reconnecting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        ) : (
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Reconnect
                    </Button>
                )}

                {!isPendingOAuth && !isPendingTelegram && !isExpiredOAuth && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewOpen(true)}
                    >
                        {raw.entitlement.integration_type === "license_key" ? (
                            <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                        ) : (
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        View
                    </Button>
                )}
            </div>
            <GrantDetailSheet
                grant={raw}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />
            <Sheet open={telegramOpen} onOpenChange={setTelegramOpen}>
                <SheetContent
                    className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6"
                    floating
                    side="right"
                >
                    <SheetHeader>
                        <SheetTitle>Connect Telegram</SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-text-secondary">
                            Open{" "}
                            <span className="font-mono text-text-primary">
                                {Mode === "live"
                                    ? "@dodo_payments_bot"
                                    : "@DodoPaymentsTestBot"}
                            </span>{" "}
                            on Telegram and send{" "}
                            <span className="font-mono text-text-primary">/start</span> to get your user ID. After linking, accept the join request the bot sends you.
                        </p>

                        <Button
                            variant="secondary"
                            className="w-fit"
                            onClick={() =>
                                window.open(
                                    Mode === "live"
                                        ? "https://t.me/dodo_payments_bot"
                                        : "https://t.me/DodoPaymentsTestBot",
                                    "_blank",
                                    "noopener,noreferrer",
                                )
                            }
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Telegram bot
                        </Button>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor={`telegram-${raw.id}`}>
                                Telegram user ID
                            </Label>
                            <Input
                                id={`telegram-${raw.id}`}
                                placeholder="123456789"
                                inputMode="numeric"
                                value={telegramUserId}
                                onChange={(e) => setTelegramUserId(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && telegramUserId.trim() && !telegramSubmitting) {
                                        handleTelegramSubmit();
                                    }
                                }}
                            />
                        </div>

                        <Button
                            className="w-full mt-2"
                            onClick={handleTelegramSubmit}
                            disabled={telegramSubmitting || !telegramUserId.trim()}
                        >
                            {telegramSubmitting ? "Linking" : "Link account"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
            <Sheet open={notionOpen} onOpenChange={setNotionOpen}>
                <SheetContent
                    className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6"
                    floating
                    side="right"
                >
                    <SheetHeader>
                        <SheetTitle>Connect Notion</SheetTitle>
                        <SheetDescription>
                            Before you continue, please review the following.
                        </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-border-secondary bg-card p-3 flex gap-2.5">
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-text-secondary" />
                            <div className="space-y-2 text-sm text-text-secondary">
                                <p>
                                    On the Notion authorization page, the page you select will be used as the destination — your template will be added as a{" "}
                                    <span className="text-text-primary font-medium">sub-page</span> under it.
                                </p>
                                <p>
                                    Delivery is asynchronous and may take up to{" "}
                                    <span className="text-text-primary font-medium">5 minutes</span> to appear in your Notion workspace after you authorize access.
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-2"
                            onClick={async () => {
                                setNotionOpen(false);
                                await handleOAuthConnect();
                            }}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Continue to Notion
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

function statusLabel(status: PortalGrantResponse["status"]): string {
    switch (status) {
        case "Delivered":
            return "Delivered";
        case "Pending":
            return "Pending";
        case "Failed":
            return "Failed";
        case "Revoked":
            return "Revoked";
        default:
            return status;
    }
}

function GrantDetailSheet({
    grant,
    open,
    onOpenChange,
}: {
    grant: PortalGrantResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);

    const isLicenseKey = grant?.entitlement.integration_type === "license_key";
    const isDigitalFiles = grant?.entitlement.integration_type === "digital_files";
    const isFramer = grant?.entitlement.integration_type === "framer";
    const isNotion = grant?.entitlement.integration_type === "notion";

    const handleReconnect = async () => {
        if (!grant) return;
        setReconnecting(true);
        const res = await reconnectEntitlementGrant(grant.id);
        setReconnecting(false);
        if (res?.oauth_url) {
            window.open(res.oauth_url, "_blank", "noopener,noreferrer");
            router.refresh();
        } else if (res) {
            toast.success("Reconnected successfully");
            router.refresh();
        } else {
            toast.error("Failed to reconnect");
        }
    };

    useEffect(() => {
        if (!open) setVisible(false);
    }, [open]);

    if (!grant) return null;

    const hasError = grant.error;
    const dpd = grant.digital_product_delivery;
    const hasDeliverable =
        dpd &&
        (dpd.files.length > 0 ||
            !!dpd.external_url ||
            !!dpd.instructions);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:max-w-md mx-auto border-border-secondary rounded-xl border m-6"
                floating
                side="right"
            >
                <SheetHeader>
                    <SheetTitle>{grant.entitlement.name}</SheetTitle>
                    <SheetDescription>
                        {TYPE_LABELS[grant.entitlement.integration_type] || grant.entitlement.integration_type}
                    </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Status</span>
                        <Badge variant={statusBadgeVariant(grant.status)} dot={false}>
                            {statusLabel(grant.status)}
                        </Badge>
                    </div>

                    {grant.delivered_at && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Delivered</span>
                            <span className="text-sm text-text-primary">
                                {parseIsoDate(grant.delivered_at)}
                            </span>
                        </div>
                    )}

                    {grant.created_at && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Created</span>
                            <span className="text-sm text-text-primary">
                                {parseIsoDate(grant.created_at)}
                            </span>
                        </div>
                    )}

                    {isLicenseKey && grant.status !== "Delivered" && (
                        <p className="text-sm text-text-secondary">
                            License key will be available once the entitlement is delivered.
                        </p>
                    )}

                    {isLicenseKey && grant.status === "Delivered" && grant.license_key && (
                        <div className="space-y-2">
                            <span className="text-sm text-text-secondary">License Key</span>
                            <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                                <p className="text-sm font-medium">
                                    {visible ? (
                                        <span className="font-mono text-text-primary">
                                            {grant.license_key.key}
                                        </span>
                                    ) : (
                                        <span className="italic text-text-secondary">
                                            Click to view license key
                                        </span>
                                    )}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-text-secondary"
                                    onClick={() => setVisible((v) => !v)}
                                >
                                    {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </Button>
                            </div>
                            {grant.license_key.expires_at && (
                                <p className="text-xs text-text-secondary">
                                    Expires {parseIsoDate(grant.license_key.expires_at)}
                                </p>
                            )}
                        </div>
                    )}

                    {grant.status === "Delivered" &&
                        grant.oauth_expires_at &&
                        new Date(grant.oauth_expires_at) < new Date() && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">OAuth connection</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReconnect}
                                disabled={reconnecting}
                            >
                                {reconnecting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                ) : (
                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                )}
                                Reconnect
                            </Button>
                        </div>
                    )}

                    {isFramer && grant.status !== "Delivered" && (
                        <p className="text-sm text-text-secondary">
                            Your Framer template link will be available once the entitlement is delivered.
                        </p>
                    )}

                    {isNotion && grant.status === "Pending" && (
                        <div className="rounded-lg border border-border-secondary bg-card p-3 flex gap-2.5">
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-text-secondary" />
                            <div className="space-y-2 text-sm text-text-secondary">
                                <p>
                                    Notion template delivery is asynchronous and may take up to{" "}
                                    <span className="text-text-primary font-medium">5 minutes</span> to be delivered after you authorize access.
                                </p>
                                <p>
                                    The template will appear as a{" "}
                                    <span className="text-text-primary font-medium">sub-page</span> inside the page you selected on Notion&apos;s authorization screen.
                                </p>
                            </div>
                        </div>
                    )}

                    {isFramer && grant.status === "Delivered" && (
                        <div className="space-y-3">
                            {grant.framer_delivery ? (
                                <div className="space-y-3">
                                    {grant.framer_delivery.template_name && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-secondary">Template</span>
                                            <span className="text-sm text-text-primary font-medium">
                                                {grant.framer_delivery.template_name}
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() =>
                                            window.open(
                                                grant.framer_delivery!.remix_link,
                                                "_blank",
                                                "noopener,noreferrer",
                                            )
                                        }
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in Framer
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-text-secondary">
                                    No Framer template link available.
                                </p>
                            )}
                        </div>
                    )}

                    {isDigitalFiles && grant.status !== "Delivered" && (
                        <p className="text-sm text-text-secondary">
                            Files will be available once the entitlement is delivered.
                        </p>
                    )}

                    {isDigitalFiles && grant.status === "Delivered" && (
                        <div className="space-y-3">
                            {dpd && (
                                <div className="space-y-3">
                                    {dpd.files.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Files</h4>
                                            {dpd.files.map((file) => (
                                                <div
                                                    key={file.file_id}
                                                    className="flex items-center justify-between p-2 border rounded"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <FileMinus className="w-4 h-4 shrink-0" />
                                                        <span className="text-sm truncate">{file.filename}</span>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(file.download_url, "_blank", "noopener,noreferrer")}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {dpd.external_url && (
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => window.open(dpd.external_url!, "_blank", "noopener,noreferrer")}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Open external link
                                        </Button>
                                    )}

                                    {dpd.instructions && (
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">Instructions</h4>
                                            <p className="text-sm text-text-secondary whitespace-pre-line">
                                                {dpd.instructions}
                                            </p>
                                        </div>
                                    )}

                                    {!hasDeliverable && (
                                        <p className="text-sm text-text-secondary">
                                            No files available.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {hasError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3">
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                Error: {hasError.code}
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                {hasError.message}
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export const EntitlementsColumns: ColumnDef<EntitlementRow>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <span className="text-sm text-text-primary font-medium">
                    {row.original.name}
                </span>
            );
        },
    },
    {
        id: "type",
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const label =
                TYPE_LABELS[row.original.type] || row.original.type;
            return (
                <Badge
                    variant="default"
                    dot={false}
                    className="rounded-sm text-xs"
                >
                    {label}
                </Badge>
            );
        },
    },
    {
        id: "date_accessed",
        accessorKey: "date_accessed",
        header: "Date Accessed",
        cell: ({ row }) => {
            return (
                <TimeTooltip
                    timeStamp={row.original.date_accessed}
                    className="text-sm text-text-primary font-medium"
                    triggerFormat="shortDate"
                />
            );
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const raw = row.original.raw;
            return (
                <Badge
                    variant={statusBadgeVariant(raw.status)}
                    dot={false}
                    className="rounded-sm text-xs"
                >
                    {statusLabel(raw.status)}
                </Badge>
            );
        },
    },
    {
        id: "action",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => <ActionCell raw={row.original.raw} />,
    },
];
