/* eslint-disable @typescript-eslint/no-explicit-any */

import { internalApi } from "@/lib/http";
import LoginCard from "../../../components/login/login-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ business_id: string }>;
}) {
  const { business_id } = await params;
  try {
    const response = await internalApi.get(
      `/checkout/businesses/${business_id}`
    );
    const business = response.data;

    return {
      title: `${business.name} - DodoPayments`,
      description: `Login or signup to access your ${business.name} - DodoPayments customer portal`,
    };
  } catch (error: any) {
    console.error("Error fetching business metadata:", error);
    return {
      title: "Dodo Payments",
      description:
        "Login or signup to access your DodoPayments customer portal",
    };
  }
}

const Page = () => {
  return (
    <main className="w-full bg-bg-primary h-full min-h-[100dvh] flex mx-auto max-w-[2160px]">
      <section className="lg:w-1/2 min-h-[100dvh] relative overflow-auto w-full h-full flex px-5 md:px-10 justify-center items-center">
        <LoginCard className="flex h-[100dvh] justify-center flex-col gap-8 w-full items-center border-none" />
      </section>
      <section className="w-1/2 hidden lg:flex h-[100dvh] p-6 rounded-xl overflow-hidden">
        <section className="w-full flex h-full border relative border-border-secondary rounded-xl  bg-cover flex-col justify-end bg-center overflow-hidden bg-[url('/images/login/login-img.png')]" />
      </section>
    </main>
  );
};

export default Page;
