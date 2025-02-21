import { Card } from "@/components/ui/card";
import Image from "next/image";
import { LoginForm } from "./login-form";

const LoginCard = () => {
  return (
    <Card className="w-full max-w-[95vw] mb-5 sm:0 sm:max-w-[400px] relative h-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/texture.png"
          width={400}
          height={400}
          alt="texture"
          className="w-full h-full object-cover"
          priority
          quality={85}
        />
      </div>
      <LoginForm />
    </Card>
  );
};

export default LoginCard;
