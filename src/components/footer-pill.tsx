import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterPill = ({
  align = "center",
}: {
  align?: "center" | "start" | "end";
}) => {
  return (
    <footer

      className={cn(
        "fixed bottom-4 md:bottom-8 left-0 w-full flex items-center justify-center px-2 sm:px-10",
        `justify-${align}`
      )}
    >
      <Link href="https://dodopayments.com" target="_blank">
        <div className="flex items-center justify-center bg-bg-secondary border border-border-secondary rounded-lg py-[10px] px-[12px] gap-[6px]">
          <Image
            src="/images/brand-assets/logo/logo.svg"
            alt="logo"
            width={20}
            height={20}
        />
        <p className="text-sm w-full text-nowrap font-light tracking-[-0.22px] font-display">
          Powered by Dodo Payments
          </p>
        </div>
      </Link>
    </footer>
  );
};

export default FooterPill;
