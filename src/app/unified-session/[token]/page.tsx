"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingOverlay from "@/components/loading-overlay";
import { api } from "@/lib/http";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = params?.token as string;

  useEffect(() => {
    async function validateBusinessToken() {
      if (!token) {
        router.push("/expired");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/business-validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.status !== 200) {
          throw new Error(
            `Failed to validate business token: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success && data.redirect) {
          router.push(data.redirect);
        } else if (data.redirect) {
          router.push(data.redirect);
        } else {
          setError("Validation failed. Please try again.");
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setError("An error occurred. Please try again.");
        router.push("/expired");
      } finally {
        setIsLoading(false);
      }
    }

    validateBusinessToken();
  }, [token, router]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[100]">
        <div className="text-center">
          <p className="text-text-primary mb-4">{error}</p>
          <button
            onClick={() => router.push("/expired")}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Go to Expired Page
          </button>
        </div>
      </div>
    );
  }

  return <LoadingOverlay />;
}
