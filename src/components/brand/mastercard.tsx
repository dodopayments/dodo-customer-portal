import Image from "next/image";
import { cn } from "@/lib/utils";

export function Mastercard({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-label="Mastercard"
    >
      <Image
        src="/payment-methods/mastercard.svg"
        width={size}
        height={size}
        alt="Mastercard"
      />
    </span>
  );
}
