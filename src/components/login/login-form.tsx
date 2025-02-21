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
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Envelope } from "@phosphor-icons/react";

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
const MagicLinkStatus = ({ email }: { email: string }) => (
  <div className="flex flex-col justify-center items-center">
    <div className="bg-bg-secondary rounded-full p-3 mb-6">
      <Envelope className="w-6 h-6 text-text-primary" />
    </div>
    <h2 className="font-semibold font-display text-center text-text-primary text-3xl">
      Check your email
    </h2>
    <div className="text-text-secondary font-light mt-1 tracking-wide text-center text-base">
      <p>We sent a login link to</p>
      <p>{email}</p>
    </div>
  </div>
);

export const LoginForm = () => {
  const [email, setEmail] = useState("");
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

    if (!validateTurnstileToken(turnstileState.token)) {
      turnstileHandlers.setError(TURNSTILE_ERROR_MESSAGES.REQUIRED);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/dashboard/customer-portal-login",
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
            {business.image ? (
              <Image
                src={business.image}
                alt={business.name}
                className="mb-6  rounded-lg object-cover object-center"
                width={38}
                height={38}
                priority
              />
            ) : (
              <div className="mb-6 w-10 h-10 bg-bg-secondary rounded-lg" />
            )}
            <CardTitle>Log into {business.name}</CardTitle>
            <CardDescription>
              Enter your email for a link to signup
            </CardDescription>
          </CardHeader>
          <CardContent className=" px-4 sm:px-8  py-8 pb-12">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                {isLoading ? "Sending..." : "Send me a link!"}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent className="px-8 py-12">
          <MagicLinkStatus email={email} />
        </CardContent>
      )}
    </div>
  );
};
