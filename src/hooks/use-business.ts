"use client";

import { useState, useEffect } from "react";
import { fetchBusiness } from "@/lib/server-actions";
import parseError from "@/lib/parseError";

export function useBusiness() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoading(true);
        const businessData = await fetchBusiness();
        setBusiness(businessData);
        setError(null);
      } catch (err) {
        parseError(err, "Failed to fetch business");
        setError("Failed to load business data");
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, []);

  return { business, loading, error };
}
