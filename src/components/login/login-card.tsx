import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import React from "react";

// const MagicLinkStatus = () => {
//   return (
//     <div className="relative z-10">
//       <CardHeader className="flex px-8 pt-12 flex-col items-center gap-2">
//         <Image
//           src="/images/business.svg"
//           alt="logo"
//           className="mb-6"
//           width={38}
//           height={38}
//         />
//         <CardTitle>Almost there!</CardTitle>
//         <CardDescription className="text-center">
//           Login using the link sent to{" "}
//           <span className="text-text-primary">johndoe@example.com</span>. Make
//           sure you check your spam folder!
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="px-8 py-8 pb-12">
//         <Button variant="secondary" className="w-full">
//           Go back
//         </Button>
//       </CardContent>
//     </div>
//   );
// };

const LoginForm = () => {
  return (
    <div className="relative z-10">
      <CardHeader className="flex px-8 pt-12 flex-col items-center gap-2">
        <Image
          src="/images/business.svg"
          alt="logo"
          className="mb-6"
          width={38}
          height={38}
        />
        <CardTitle>Log into Turbo Repo</CardTitle>
        <CardDescription>Enter your email for a link to signup</CardDescription>
      </CardHeader>
      <CardContent className="px-8 py-8 pb-12">
        <form className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input placeholder="Enter your email" />
          </div>
          <Button>Send me a link!</Button>
        </form>
      </CardContent>
    </div>
  );
};

const LoginCard = () => {
  return (
    <Card className="w-full max-w-[90vw] mb-5 sm:0 sm:max-w-[400px] relative h-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/texture.png"
          width={400}
          height={400}
          alt="texture"
          className="w-full h-full object-cover"
        />
      </div>
      <LoginForm />
      {/* <MagicLinkStatus /> */}
    </Card>
  );
};

export default LoginCard;
