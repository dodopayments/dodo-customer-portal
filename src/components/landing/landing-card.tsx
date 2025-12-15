"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowCounterClockwise,
  DownloadSimple,
  Question,
  Eye,
  ReceiptX,
  Envelope,
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

interface Action {
  name: string;
  icon: React.ReactNode;
}

export const LandingCard = ({ className }: { className?: string }) => {
  const actions: Action[] = [
    {
      name: "Request Refund",
      icon: <ArrowCounterClockwise />,
    },
    {
      name: "Cancel subscription",
      icon: <ReceiptX />,
    },
    {
      name: "Download invoices",
      icon: <DownloadSimple />,
    },
    {
      name: "View orders processed through Dodo Payments",
      icon: <Eye />,
    },
    {
      name: "Other queries",
      icon: <Question />,
    },
  ];
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [turnstileState, setTurnstileState] = useState<TurnstileState>({
    token: undefined,
    error: null,
  });
  const turnstileRef = useRef<any>(null);
  const turnstileHandlers = createTurnstileHandlers(
    turnstileRef,
    setTurnstileState
  );

  const handleEmailSubmit = async () => {
    // First click reveals the form; subsequent clicks attempt submission
    if (!isFormVisible) {
      setIsFormVisible(true);
      return;
    }

    if (!email.includes("@") || email.length === 0 || !email.includes(".")) {
      setEmailError("Please enter a valid email address");
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
      console.log(response);
      if (response.status === 200) {
        setIsDone(true);
      } else {
        setEmailError("Failed to send login link. Please try again.");
      }
    } catch (error) {
      console.log(error);
      parseError(error, "Failed to send login link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="max-w-2xl p-2">
        <CardHeader className="pb-6">
          {!isDone && (
            <CardTitle className="text-lg sm:text-xl">
              What can we help you with today?
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isDone && (
            <>
              <div className="flex flex-col gap-4 rounded-lg border border-border-secondary p-3 sm:p-4">
                <div className="border-b border-border-secondary pb-4">
                  <p className="text-sm sm:text-base">
                    You can do the following actions:
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 flex-wrap">
                  {actions.map((action) => (
                    <div
                      key={action.name}
                      className="flex flex-row gap-2 items-center text-text-secondary w-fit"
                    >
                      {action.icon}
                      <p className="text-sm sm:text-base">{action.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              {isFormVisible && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
              {/* email icon */}
              <div className="w-10 h-10 bg-bg-secondary rounded-full flex items-center justify-center text-text-primary">
                <Envelope />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-lg font-semibold text-center">
                  We&apos;ve sent you an email!
                </h3>
                <p className="text-text-secondary text-sm text-center max-w-xs">
                  Use the link in the email to login to the Dodo Payments self
                  serve portal
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
                  ? "Sending..."
                  : "Send email"
                : "Look up my purchase"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
