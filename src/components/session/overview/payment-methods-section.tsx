"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import {
  getPaymentMethodLogoUrl,
  getPaymentMethodDisplayName,
} from "../payment-methods/payment-method-logo";
import { CircleSlash } from "lucide-react";
import Image from "next/image";

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethodItem[];
}

export function PaymentMethodsSection({
  paymentMethods,
}: PaymentMethodsSectionProps) {
  const isEmpty = !paymentMethods || paymentMethods.length === 0;

  return (
    <section id="payment-methods">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-medium text-text-primary">
          Payment Methods
        </h2>
      </div>

      <Card>
        <CardContent className="p-0">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-bg-secondary rounded-full mb-4">
                <CircleSlash className="w-6 h-6 text-text-secondary" />
              </div>
              <p className="text-text-secondary text-sm mb-4">
                No payment methods added
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-secondary">
              {paymentMethods.map((paymentMethod) => {
                const logo = getPaymentMethodLogoUrl(
                  paymentMethod.payment_method_type,
                  paymentMethod.payment_method,
                  paymentMethod.card?.card_network,
                  paymentMethod.card?.card_type,
                );
                const displayName = getPaymentMethodDisplayName(paymentMethod);
                const isCard = paymentMethod.payment_method === "card";
                const card = paymentMethod.card;

                return (
                  <div
                    key={paymentMethod.payment_method_id}
                    className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-bg-secondary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Logo */}
                      <div className="border border-border-secondary rounded-md p-2 flex items-center justify-center w-12 h-9 bg-bg-primary">
                        {logo?.type === "url" && logo.url ? (
                          <Image
                            src={logo.url}
                            alt={displayName}
                            width={32}
                            height={24}
                            className="object-contain"
                            unoptimized
                          />
                        ) : logo?.type === "icon" && logo.Icon ? (
                          <logo.Icon
                            size={28}
                            className="text-text-primary"
                            weight="regular"
                          />
                        ) : (
                          <div className="w-8 h-6 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              {displayName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {displayName}
                          {isCard && card?.card_network && (
                            <span className="text-text-secondary ml-2">
                              {card.card_network}
                            </span>
                          )}
                        </span>
                        {isCard && card?.last4_digits && (
                          <span className="text-xs text-text-secondary">
                            •••• {card.last4_digits}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
