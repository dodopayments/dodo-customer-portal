import LoginCard from "../../../components/login/login-card";
import FooterPill from "@/components/footer-pill";

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
