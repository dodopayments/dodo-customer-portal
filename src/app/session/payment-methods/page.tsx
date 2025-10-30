import { Card, CardContent } from "@/components/ui/card";
import { DummyPaymentMethod, fetchPaymentMethods } from "./action";
import { GPay } from "@/components/brand/gpay";
import { Mastercard } from "@/components/brand/mastercard";
import { ApplePay } from "@/components/brand/applepay";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

export default async function PaymentMethodsPage() {
    const paymentMethods = await fetchPaymentMethods();
    return (
        <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
            <div className="flex flex-col gap-3">
                <h4 className="text-text-primary text-lg font-medium">Your payment methods</h4>
                <Card className="p-6 flex flex-col items-start gap-4 flex-none order-1 self-stretch flex-grow-0">
                    <div className="flex flex-col gap-4 w-full">
                        {paymentMethods.map((paymentMethod) => (
                            <PaymentMethodCard key={paymentMethod.id} paymentMethod={paymentMethod} />
                        ))}
                    </div>
                    <div className="flex">
                        <Button variant="secondary" className="my-auto">Add payment method</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function PaymentMethodCard({ paymentMethod }: { paymentMethod: DummyPaymentMethod }) {
    return (
        <Card className="flex flex-col items-start gap-4 flex-none order-1 self-stretch flex-grow-0">
            <CardContent className="flex flex-row justify-between gap-8 p-2 w-full">
                <div className="flex flex-row gap-4 p-2 w-full">
                    <div className="border border-border-secondary rounded-md p-2">
                        {paymentMethod.brand === "mastercard" && <Mastercard size={30} className="my-auto" />}
                        {paymentMethod.brand === "google" && <GPay size={30} className="my-auto" />}
                        {paymentMethod.brand === "apple" && <ApplePay size={30} className="my-auto" />}
                    </div>
                    <p className="text-text-primary text-base font-medium leading-none my-auto">{paymentMethod.name}</p>
                    {paymentMethod.type === "card" && (
                        <div className="flex flex-row gap-2">
                            <p className="text-text-secondary my-auto">••••</p>
                            <p className="text-text-secondary my-auto">{paymentMethod.last4}</p>
                        </div>
                    )}
                </div>
                <Button variant="outline" size="icon" className="my-auto p-2">
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </CardContent>
        </Card>
    )
}