import Image from "next/image";
import { LandingCard } from "@/components/landing/landing-card";
import { LandingInfoCard } from "@/components/landing/landing-info-card";

export default function Page() {
  return (
    <div
      className="flex flex-col min-h-screen min-w-screen p-2 sm:p-3 bg-background overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 8.49%, hsl(var(--background)) 68.49%), url('/images/landing/background.png')",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto px-2 sm:px-0 flex-grow">
        <Image
          src="/images/brand-assets/logo/logo-name-dark.svg"
          alt="Dodo Payments"
          width={140}
          height={182}
          className="w-[100px] sm:w-[140px] h-auto"
          priority
        />
        <LandingCard className="w-full" />
      </div>

      <div className="flex justify-center mt-auto pb-4 sm:pb-6 px-2 sm:px-3">
        <LandingInfoCard className="w-full max-w-2xl" />
      </div>
    </div>
  );
}