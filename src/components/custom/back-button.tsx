"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function BackButton({ fallbackUrl }: { fallbackUrl: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button variant="secondary" onClick={handleBack}>
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
}

