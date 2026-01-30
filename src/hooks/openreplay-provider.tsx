"use client";

import { ReactNode, useEffect } from "react";
import OpenReplay from '@openreplay/tracker';

let tracker: OpenReplay | null = null;

export function CSOpenReplayProvider({ children }: { children: ReactNode }) {
    const projectKey = process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY;
    const ingestPoint = process.env.NEXT_PUBLIC_OPENREPLAY_INGEST_POINT;
    const isOpenReplayConfigured = !!projectKey;

    useEffect(() => {
        if (typeof window !== "undefined" && !tracker && isOpenReplayConfigured) {
            tracker = new OpenReplay({
                projectKey: projectKey,
                inlineCss: 3,
                ...(ingestPoint && { ingestPoint }),
                capturePerformance: true,
            });

            tracker.start()
        }
    }, [isOpenReplayConfigured, projectKey, ingestPoint]);

    return <>{children}</>;
}
