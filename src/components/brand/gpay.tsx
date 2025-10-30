import Image from "next/image";
import { cn } from "@/lib/utils";

export function GPay({ size = 36, className }: { size?: number, className?: string }) {
    return (
        <span
            className={cn("inline-flex items-center gap-1 justify-center", className)}
            aria-label="Google Pay"
        >
            <Image
                src="/payment-methods/google.svg"
                width={size}
                height={size}
                alt="Google"
            />
            <span className="font-semibold">Pay</span>
        </span>
    )
}