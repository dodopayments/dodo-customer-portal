"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DownloadSimple,
  Question,
  Eye,
  ReceiptX,
  Envelope,
  CreditCard,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { api } from "@/lib/http";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  TURNSTILE_ERROR_MESSAGES,
  TurnstileState,
  createTurnstileHandlers,
  handleTurnstileError,
  handleTurnstileExpired,
  validateTurnstileToken,
} from "@/lib/turnstile";
import parseError from "@/lib/clientErrorHelper";
import { useTranslations } from "next-intl";

interface Action {
  name: string;
  icon: React.ReactNode;
}

export const LandingCard = ({ className }: { className?: string }) => {
  const t = useTranslations("LandingCard");

  const actions: Action[] = [
    { name: t("actions.changePaymentMethod"), icon: <CreditCard /> },
    { name: t("actions.cancelSubscription"), icon: <ReceiptX /> },
    { name: t("actions.downloadInvoices"), icon: <DownloadSimple /> },
    { name: t("actions.viewOrders"), icon: <Eye /> },
    { name: t("actions.otherQueries"), icon: <Question /> },
  ];

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [turnstileState, setTurnstileState] = useState<TurnstileState>({
    token: undefined,
    error: null,
  });
  const turnstileRef = useRef(null);
  const turnstileHandlers = createTurnstileHandlers(
    turnstileRef,
    setTurnstileState
  );

  const handleEmailSubmit = async () => {
    if (!isFormVisible) {
      setIsFormVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t("emailInvalid"));
      return;
    }
    setEmailError("");

    if (!validateTurnstileToken(turnstileState.token)) {
      turnstileHandlers.setError(TURNSTILE_ERROR_MESSAGES.REQUIRED);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/unified-customer-portal-login",
        { email },
        { headers: { "cf-turnstile-response": turnstileState.token || "" } }
      );
      if (response.status === 200) {
        setIsDone(true);
      } else {
        setEmailError(t("emailFailed"));
      }
    } catch (error) {
      parseError(error, t("emailFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="max-w-2xl p-2">
        <CardHeader className="pb-6">
          {!isDone && (
            <CardTitle className="text-lg sm:text-xl">{t("heading")}</CardTitle>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isDone && (
            <>
              <div className="flex flex-col gap-4 rounded-lg border border-border-secondary p-3 sm:p-4">
                <div className="border-b border-border-secondary pb-4">
                  <p className="text-sm sm:text-base">{t("actionsIntro")}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
                  {actions.map((action) => (
                    <div
                      key={action.name}
                      className="flex flex-row gap-2 items-center text-text-secondary w-fit"
                    >
                      {action.icon}
                      <p className="text-sm">{action.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              {isFormVisible && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>{t("emailLabel")}</Label>
                    <Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className="w-full"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                    />
                    {emailError && (
                      <p
                        className="text-text-error-primary text-sm"
                        role="alert"
                      >
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Turnstile
                      ref={turnstileRef}
                      className="pl-1 w-full mt-1"
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!}
                      onSuccess={turnstileHandlers.setToken}
                      onError={(error) =>
                        handleTurnstileError(error, turnstileHandlers)
                      }
                      onExpire={() => handleTurnstileExpired(turnstileHandlers)}
                      options={{ size: "flexible" }}
                    />
                    {turnstileState.error && (
                      <p
                        className="text-text-error-primary text-sm"
                        role="alert"
                      >
                        {turnstileState.error}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {isDone && (
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-10 h-10 bg-bg-secondary rounded-full flex items-center justify-center text-text-primary">
                <Envelope />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-lg font-semibold text-center">
                  {t("sentTitle")}
                </h3>
                <p className="text-text-secondary text-sm text-center max-w-xs">
                  {t("sentDescription")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          {!isDone && (
            <Button
              className="w-full text-sm sm:text-base"
              onClick={handleEmailSubmit}
              disabled={isLoading}
            >
              {isFormVisible
                ? isLoading
                  ? t("sending")
                  : t("sendEmail")
                : t("lookUpPurchase")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
