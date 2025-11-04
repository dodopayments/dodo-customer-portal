"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ApplePay } from "../brand/applepay";
import { GPay } from "../brand/gpay";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  formatCardNumber,
  formatExpiryDate,
  unformatCardNumber,
  parseExpiryDate,
} from "@/lib/payment-helper";

export function AddPaymentMethodSheet() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<
    "card" | "gpay" | "applepay" | "affirm" | "klarna"
  >("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleExpiryDateKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Allow backspace, delete, tab, escape, enter
    if (
      e.key === "Backspace" &&
      expiryDate.length === 3 &&
      expiryDate.endsWith("/")
    ) {
      // If user backspaces the slash, remove it and the last digit
      setExpiryDate(expiryDate.slice(0, 1));
      e.preventDefault();
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleCardNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace when cursor is right after a space
    if (e.key === "Backspace" && cardNumber.length > 0) {
      const cursorPosition = (e.target as HTMLInputElement).selectionStart || 0;
      if (cursorPosition > 0 && cardNumber[cursorPosition - 1] === " ") {
        // If backspacing a space, remove it and the previous digit
        const digitsOnly = unformatCardNumber(cardNumber);
        const newValue = digitsOnly.slice(0, digitsOnly.length - 1);
        const formatted = formatCardNumber(newValue);
        setCardNumber(formatted);
        e.preventDefault();

        // Set cursor position
        setTimeout(() => {
          const input = e.target as HTMLInputElement;
          const newPosition = Math.max(0, cursorPosition - 2);
          input.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  };

  const handleAddCard = () => {
    const cardNumberDigits = unformatCardNumber(cardNumber);
    const expiryParsed = parseExpiryDate(expiryDate);
    console.log(
      cardNumberDigits,
      expiryParsed?.month,
      expiryParsed?.year,
      securityCode,
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        className="my-auto"
        onClick={() => setOpen(true)}
      >
        Add payment method
      </Button>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle className="text-left font-display font-semibold text-base leading-tight tracking-normal">
            Add payment method
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 w-full">
            <Button className="w-full">
              <ApplePay size={30} className="my-auto" invert={false} />
            </Button>
            <Button variant="secondary" className="w-full">
              <GPay size={30} className="my-auto" />
            </Button>
          </div>
          <div className="flex items-center gap-4 my-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-row gap-2 w-full">
            <Card
              className={cn(
                "flex flex-col p-3 w-full h-full gap-2 justify-between cursor-pointer transition-colors",
                "hover:bg-accent/50",
                selected === "card" && "border-border-brand",
              )}
              onClick={() => setSelected("card")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected("card");
                }
              }}
            >
              <CreditCard className="w-4 h-4 text-text-secondary my-auto" />
              <span className="text-sm font-medium">Card</span>
            </Card>
            <Card
              className={cn(
                "flex flex-col p-3 w-full h-full gap-2 justify-between cursor-pointer transition-colors",
                "hover:bg-accent/50",
                selected === "affirm" && "border-border-brand",
              )}
              onClick={() => setSelected("affirm")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected("affirm");
                }
              }}
            >
              <Image
                src="/payment-methods/affirm.svg"
                className="my-auto"
                alt="Affirm"
                width={30}
                height={30}
              />
              <span className="text-sm font-medium">Affirm</span>
            </Card>
            <Card
              className={cn(
                "flex flex-col p-3 w-full h-full gap-2 justify-between cursor-pointer transition-colors",
                "hover:bg-accent/50",
                selected === "klarna" && "border-border-brand",
              )}
              onClick={() => setSelected("klarna")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected("klarna");
                }
              }}
            >
              <Image
                src="/payment-methods/klarna.jpg"
                className="my-auto"
                alt="Klarna"
                width={16}
                height={16}
              />
              <span className="text-sm font-medium">Klarna</span>
            </Card>
          </div>
          {selected === "card" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  type="text"
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onKeyDown={handleCardNumberKeyDown}
                  maxLength={19}
                />
              </div>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="expiry-date">Expiry date</Label>
                  <Input
                    type="text"
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    onKeyDown={handleExpiryDateKeyDown}
                    maxLength={5}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="security-code">Security code</Label>
                  <Input
                    type="text"
                    id="security-code"
                    placeholder="123"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                By providing your card information, you allow Lummi to charge
                your card for future payments in accordance with their terms.
              </p>
              <Separator className="my-3" />
            </div>
          )}
          <Button className="w-full" onClick={handleAddCard}>
            Add
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
