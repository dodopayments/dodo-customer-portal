/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { z } from "zod";

import {
  TURNSTILE_ERROR_MESSAGES,
  TurnstileState,
  createTurnstileHandlers,
  handleTurnstileError,
  handleTurnstileExpired,
  validateTurnstileToken,
} from "@/lib/turnstile";
import { api, internalApi } from "@/lib/http";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import LoadingOverlay from "../loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const emailSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

const MagicLinkStatus = ({
  email,
  business,
  setSuccess,
}: {
  email: string;
  business: any;
  setSuccess: (success: boolean) => void;
}) => (
  <CardHeader className="flex px-7 pb-4 pt-12 flex-col items-center gap-2">
    <Avatar className="mb-6">
      <AvatarImage src={business.image} />
      <AvatarFallback name={business.name} />
    </Avatar>
    <CardTitle>Almost there!</CardTitle>
    <CardDescription className="text-center">
    Access link sent to email{" "}
      <span className="text-text-primary">{email}</span>. Make sure you check
      your spam folder!
    </CardDescription>
    <Button
      variant={"secondary"}
      className="w-full mt-2"
      onClick={() => setSuccess(false)}
    >
      Go back
    </Button>
  </CardHeader>
);



export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const params = useParams();
  const business_id = params.business_id as string;
  const [pageLoading, setPageLoading] = useState(true);
  const [business, setBusiness] = useState<any>({
    name: "",
    image: "/images/business.svg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileState, setTurnstileState] = useState<TurnstileState>({
    token: undefined,
    error: null,
  });
  const turnstileRef = useRef<any>(null);
  const turnstileHandlers = createTurnstileHandlers(
    turnstileRef,
    setTurnstileState
  );

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setPageLoading(true);
        const response = await internalApi.get(
          `/checkout/businesses/${business_id}`
        );
        setBusiness(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchBusiness();
  }, [business_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    try {
      emailSchema.parse({ email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
        return;
      }
    }

    if (!validateTurnstileToken(turnstileState.token)) {
      turnstileHandlers.setError(TURNSTILE_ERROR_MESSAGES.REQUIRED);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/customer-portal-login",
        {
          email,
          business_id: business_id,
        },
        {
          headers: {
            "cf-turnstile-response": turnstileState.token,
          },
        }
      );
      console.log(
        "Submitting:",
        email,
        "with turnstile token:",
        turnstileState.token,
        response
      );
      toast.success("Login link sent to email");
      setSuccess(true);
    } catch (error) {
      toast.error("Failed to send login link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="relative z-10">
      
      {!success ? (
        <>
          <CardHeader className="flex px-8 pt-12 flex-col items-center gap-2">
            <Avatar className="mb-6">
              <AvatarImage src={business.image} />
              <AvatarFallback name={business.name} />
            </Avatar>
            <CardTitle>{business.name}&apos;s Customer Portal</CardTitle>
            <CardDescription>
            Enter your email to receive the access link to your customer portal
            </CardDescription>
          </CardHeader>
          <CardContent className=" px-4 sm:px-8  py-8 pb-12">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className={emailError ? "border-text-error-primary" : ""}
                />
                {emailError && (
                  <p className="text-text-error-primary text-sm" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full">
                <Turnstile
                  ref={turnstileRef}
                  className="pl-1 w-full  mt-1"
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!}
                  onSuccess={turnstileHandlers.setToken}
                  onError={(error) =>
                    handleTurnstileError(error, turnstileHandlers)
                  }
                  onExpire={() => handleTurnstileExpired(turnstileHandlers)}
                />
                {turnstileState.error && (
                  <p className="text-red-500 text-sm mb-2" role="alert">
                    {turnstileState.error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !!turnstileState.error}
              >
                {isLoading ? "Sending..." : "Get Access Link!"}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <MagicLinkStatus
            email={email}
            business={business}
            setSuccess={setSuccess}
          />
        </CardContent>
      )}
    </div>
  );
};
