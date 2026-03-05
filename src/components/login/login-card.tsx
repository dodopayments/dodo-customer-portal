import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";
import type { LoginBusiness } from "./login-form";
import FooterPill from "../footer-pill";

const LoginCard = ({
  className,
  initialBusiness,
}: {
  className?: string;
  initialBusiness: LoginBusiness | null;
}) => {
  return (
    <Card className={cn("w-full relative h-full overflow-hidden", className)}>
      <LoginForm
        className="w-full max-w-md mx-auto"
        initialBusiness={initialBusiness}
      />
      <div className="w-full flex justify-center absolute bottom-4 md:bottom-8">
        <FooterPill align="center" isFixed={false} />
      </div>
    </Card>
  );
};

export default LoginCard;
