import { CurrencyCode } from "@/lib/currency-helper";

export type DummyProduct = {
  product_id: string;
  name: string;
  description?: string;
  price: number;
  currency: CurrencyCode;
  payment_frequency_interval: "month" | "year";
  is_recurring: boolean;
};

export const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    product_id: "prod_1",
    name: "Basic Plan",
    description:
      "Perfect for individuals getting started. Includes all essential features with basic support.",
    price: 9.99,
    currency: "USD",
    payment_frequency_interval: "month",
    is_recurring: true,
  },
  {
    product_id: "prod_2",
    name: "Professional Plan",
    description:
      "Ideal for growing teams. Advanced features, priority support, and team collaboration tools.",
    price: 29.99,
    currency: "USD",
    payment_frequency_interval: "month",
    is_recurring: true,
  },
  {
    product_id: "prod_3",
    name: "Enterprise Plan",
    description:
      "For large organizations. Custom integrations, dedicated support, and advanced security features.",
    price: 99.99,
    currency: "USD",
    payment_frequency_interval: "month",
    is_recurring: true,
  },
  {
    product_id: "prod_4",
    name: "Annual Pro Plan",
    description:
      "Save 20% with annual billing. All Professional features with yearly commitment.",
    price: 287.9,
    currency: "USD",
    payment_frequency_interval: "year",
    is_recurring: true,
  },
];


