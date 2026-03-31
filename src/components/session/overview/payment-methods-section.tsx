"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethodItem } from "@/app/session/payment-methods/type";
import { CircleSlash } from "lucide-react";
import { PaymentMethodCard } from "../payment-methods/payment-method-card";

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

      {isEmpty ? (
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-bg-secondary rounded-full mb-4">
                <CircleSlash className="w-6 h-6 text-text-secondary" />
              </div>
              <p className="text-text-secondary text-sm mb-4">
                No payment methods added
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {paymentMethods.map((paymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.payment_method_id}
              paymentMethod={paymentMethod}
            />
          ))}
        </div>
      )}
    </section>
  );
}
