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
import { useState, useRef, useMemo } from "react";
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
import { api } from "@/lib/http";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import parseError from "@/lib/clientErrorHelper";
import { useTranslations } from "next-intl";

export interface LoginBusiness {
  name: string;
  image?: string | null;
}

const MagicLinkStatus = ({
  email,
  business,
  setSuccess,
}: {
  email: string;
  business: LoginBusiness;
  setSuccess: (success: boolean) => void;
}) => {
  const t = useTranslations("LoginForm");
  return (
    <CardHeader className="flex px-7 pb-4 pt-12 flex-col items-center gap-2">
      <Avatar className="mb-6">
        <AvatarImage src={business.image || undefined} />
        <AvatarFallback name={business.name} />
      </Avatar>
      <CardTitle>{t("successTitle")}</CardTitle>
      <CardDescription className="text-center">
        {t("successDescription", { email })}
      </CardDescription>
      <Button
        variant={"secondary"}
        className="w-full mt-4"
        onClick={() => setSuccess(false)}
      >
        {t("goBack")}
      </Button>
    </CardHeader>
  );
};

export const LoginForm = ({
  className,
  initialBusiness,
}: {
  className?: string;
  initialBusiness: LoginBusiness | null;
}) => {
  const t = useTranslations("LoginForm");
  const emailSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .email(t("emailInvalid"))
          .min(1, t("emailRequired")),
      }),
    [t]
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const params = useParams();
  const business_id = params.business_id as string;
  const [business] = useState<LoginBusiness>({
    name: initialBusiness?.name || "",
    image: initialBusiness?.image || "",
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
      await api.post(
        "/customer-portal-login?send_email=false",
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

      toast.success(t("loginLinkSent"));
      setSuccess(true);
    } catch (error) {
      parseError(error, t("loginLinkFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative z-10", className)}>
      {!success ? (
        <>
          <CardHeader className="flex px-8 pt-12 flex-col items-center">
            <Avatar className="mb-6">
              <AvatarImage src={business.image || undefined} />
              <AvatarFallback name={business.name} />
            </Avatar>
            <CardTitle className="text-center text-[22px]">
              {t("billingPortalTitle", { businessName: business.name })}
            </CardTitle>
            <CardDescription className="text-center text-[14px]">
              {t("enterEmailDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className=" px-4 sm:px-8  py-8 pt-5 pb-12">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("emailPlaceholder")}
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
                  options={{
                    size: "flexible",
                  }}
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
                {isLoading ? t("sending") : t("getAccessLink")}
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
