"use client";

import { CircleSlash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BaseDataGrid } from "@/components/table/BaseDataGrid";
import {
    EntitlementsColumns,
    type EntitlementRow,
} from "./entitlements-columns";
import type { PortalGrantResponse } from "@/app/session/entitlements/actions";

const PAGE_SIZE = 25;

function mapGrantToRow(grant: PortalGrantResponse): EntitlementRow {
    return {
        id: grant.id,
        name: grant.entitlement.name,
        type: grant.entitlement.integration_type,
        date_accessed: grant.delivered_at || grant.created_at,
        status: grant.status === "Delivered" ? "active" : "inactive",
        raw: grant,
    };
}

interface EntitlementsTableProps {
    grants: PortalGrantResponse[];
}

export function EntitlementsTable({ grants }: EntitlementsTableProps) {
    const data = grants.map(mapGrantToRow);
    const isEmpty = data.length === 0;

    return (
        <section id="entitlements">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-medium text-text-primary">
                    Entitlements
                </h2>
            </div>

            {isEmpty ? (
                <Card>
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 bg-bg-secondary rounded-full mb-4">
                                <CircleSlash className="w-6 h-6 text-text-secondary" />
                            </div>
                            <p className="text-text-secondary text-sm">
                                No entitlements available
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <BaseDataGrid
                    tableId="entitlements-overview"
                    data={data}
                    columns={EntitlementsColumns}
                    manualPagination
                    initialPageSize={PAGE_SIZE}
                    tableLayout={{
                        autoWidth: false,
                        columnsPinnable: true,
                        columnsResizable: true,
                        columnsMovable: true,
                        columnsVisibility: true,
                        disableRowPerPage: true,
                    }}
                    disablePagination={data.length <= PAGE_SIZE}
                    emptyStateMessage="No entitlements available"
                />
            )}
        </section>
    );
}
