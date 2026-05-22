/* eslint-disable @typescript-eslint/no-explicit-any */

import LoginCard from "../../../components/login/login-card";
import InfoBox from "@/components/custom/InfoBox";
import parseError from "@/lib/serverErrorHelper";
import { getServerMode } from "@/lib/server-http";
import { ssrProxyFetch } from "@/lib/ssr-proxy";
import { cache } from "react";
import type { LoginBusiness } from "@/components/login/login-form";

const getBusinessForLogin = cache(
  async (business_id: string): Promise<LoginBusiness | null> => {
    try {
      const response = await ssrProxyFetch({
        path: `/checkout/businesses/${business_id}`,
        method: "GET",
        targetBackend: "internal",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch business metadata: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      parseError(error, "Failed to fetch business metadata");
      return null;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ business_id: string }>;
}) {
  const { business_id } = await params;
  const business = await getBusinessForLogin(business_id);
  if (!business?.name) {
    return {
      title: "Dodo Payments",
      description: "Login or signup to access your DodoPayments customer portal",
    };
  }

  return {
    title: `${business.name} - DodoPayments`,
    description: `Login or signup to access your ${business.name} - DodoPayments customer portal`,
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ business_id: string }>;
}) => {
  const { business_id } = await params;
  const business = await getBusinessForLogin(business_id);
  const mode = await getServerMode();
  const isTestMode = mode === "test";

  return (
    <main className="w-full bg-bg-primary h-full min-h-[100dvh] flex mx-auto max-w-[2160px]">
      <section className="lg:w-1/2 min-h-[100dvh] relative overflow-auto w-full h-full flex flex-col px-5 md:px-10 justify-center items-center">
        {isTestMode && (
          <div className="w-full max-w-md pt-5">
            <InfoBox
              color="yellow"
              message="You’re currently in test mode. Emails will not be sent. To test email delivery, switch to live mode."
            />
          </div>
        )}
        <LoginCard
          className="flex h-[100dvh] justify-center flex-col gap-8 w-full items-center border-none"
          initialBusiness={business}
          isTestMode={isTestMode}
        />
      </section>
      <section className="w-1/2 hidden lg:flex h-[100dvh] p-6 rounded-xl overflow-hidden">
        <section className="w-full flex h-full border relative border-border-secondary rounded-xl  bg-cover flex-col justify-end bg-center overflow-hidden bg-[url('/images/login/login-img.png')]" />
      </section>
    </main>
  );
};

export default Page;
