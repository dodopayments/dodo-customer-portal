import { cn } from "@/lib/utils";
import Image from "next/image";

export function ApplePay({ size = 36, className, invert = true }: { size?: number, className?: string, invert?: boolean }) {
    return (
        <span
            className={cn("inline-flex items-center gap-1 justify-center", className)}
            aria-label="Apple Pay"
        >
            <Image
                src="/payment-methods/apple.svg"
                className={cn(invert && "dark:invert")}
                width={size}
                height={size}
                alt="Apple"
            />
            <span className="font-semibold">Pay</span>
        </span>
    )
}


