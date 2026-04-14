"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBusiness } from "@/hooks/use-business";
import { useTranslations } from "next-intl";

export function LeftPanel() {
  const t = useTranslations("LeftPanel");
  const { business } = useBusiness();
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [isReturnUrlChecked, setIsReturnUrlChecked] = useState(false);

  useEffect(() => {
    try {
      setReturnUrl(sessionStorage.getItem("return_url"));
    } catch {
      // sessionStorage unavailable (SSR, sandboxed iframe, privacy mode)
    }
    setIsReturnUrlChecked(true);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-bg-secondary border-r border-border-secondary p-8 sticky top-0 h-screen">
      <div className="flex-1">
        {returnUrl ? (
          <button
            onClick={() => window.location.assign(returnUrl)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">
              {t("goBackTo", { businessName: business?.name || "Business" })}
            </span>
          </button>
        ) : !isReturnUrlChecked ? (
          <div className="mb-6 h-5 w-36 bg-bg-primary rounded animate-pulse" aria-hidden="true" />
        ) : null}
        <h1 className="text-2xl font-display font-semibold text-text-primary leading-tight mb-4">
          {t("heading")}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="mt-auto pt-8 flex items-center gap-4 text-xs text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <span>{t("poweredBy")}</span>
          <Link
            href="https://dodopayments.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors font-medium"
          >
            <Image
              src="/images/brand-assets/logo/logo.svg"
              alt="Dodo Payments"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Dodo Payments</span>
          </Link>
        </span>
        <span className="text-text-tertiary">|</span>
        <Link href="https://dodopayments.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
          {t("privacy")}
        </Link>
        <Link href="https://dodopayments.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
          {t("terms")}
        </Link>
      </div>
    </aside>
  );
}
