"use client";

import { useState, useEffect } from "react";
import { fetchBusiness } from "@/lib/server-actions";

export function useBusiness() {
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
        console.error('Failed to fetch business:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, []);

  return { business, loading, error };
}
