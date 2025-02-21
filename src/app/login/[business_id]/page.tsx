/* eslint-disable @typescript-eslint/no-explicit-any */

import { internalApi } from "@/lib/http";
import LoginCard from "../../../components/login/login-card";
import FooterPill from "@/components/footer-pill";

export async function generateMetadata({ params }: { params: any }) {
  try {
    const response = await internalApi.get(
      `/checkout/businesses/${params.business_id}`
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
    <section className="relative min-h-screen w-full">
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoginCard />
      </div>
      <FooterPill align="center" />
    </section>
  );
};

export default Page;
