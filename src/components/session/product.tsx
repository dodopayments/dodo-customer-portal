"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/server-actions";
import { api_url } from "@/lib/http";
import { formatCurrency } from "@/lib/currency-helper";
import { decodeCurrency } from "@/lib/currency-helper";
import { CurrencyCode } from "@/lib/currency-helper";
import { AttachmentsSheet } from "./orders/attachment-sheets";
import { Separator } from "../ui/separator";
import { LicenseSheets } from "./orders/license-sheets";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { renderSubscriptionBadges } from "./subscription-utils";
import ProductMarkdownDescription from "../common/product-markdown-description";

export interface DigitalProductResponse {
  product_id: string;
  name: string;
  description?: string;
  deliverable: {
    files?: Array<{
      file_id: string;
      file_name: string;
      url: string;
    }>;
    external_url?: string;
    instructions?: string;
  };
}

export interface LicenseKeyResponse {
  activations_limit: number;
  expires_at: string;
  id: string;
  instances_count: number;
  key: string;
  status: string;
}

export interface ProductCartItem {
  currency: string;
  digital_product_deliverable: null;
  is_subscription: boolean;
  license_keys: LicenseKeyResponse[];
  price: number;
  product_description: string;
  product_id: string;
  product_image: string;
  product_name: string;
  quantity: number;
}

export const Product = ({
  payment_id,
  subscription_id,
  product,
}: {
  payment_id: string;
  subscription_id: string | null;
  product: ProductCartItem;
}) => {
  const router = useRouter();
  const [isAttachmentsSheetOpen, setIsAttachmentsSheetOpen] = useState(false);
  const [digitalProducts, setDigitalProducts] =
    useState<DigitalProductResponse | null>(null);
  const [digitalProductsLoading, setDigitalProductsLoading] = useState(false);
  const [digitalProductsError, setDigitalProductsError] = useState<
    string | null
  >(null);
  const [isLicenseSheetOpen, setIsLicenseSheetOpen] = useState(false);
  const [subscription, setSubscription] =
    useState<SubscriptionDetailsData | null>(null);

  useEffect(() => {
    if (subscription_id) {
      getSubscription();
    }
  }, [subscription_id]);

  useEffect(() => {
    if (isAttachmentsSheetOpen && !digitalProducts && !digitalProductsLoading) {
      setDigitalProductsError(null);
      fetchDigitalProducts();
    }
  }, [isAttachmentsSheetOpen, product.product_id]);
  const fetchDigitalProducts = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      setDigitalProductsLoading(true);
      const response = await fetch(
        `${api_url}/customer-portal/payments/${payment_id}/digital-product-deliverables`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDigitalProducts(data.items[0]);
        setDigitalProductsError(null);
      } else {
        setDigitalProductsError("Failed to load digital products.");
      }
    } catch (error) {
      console.error("Failed to fetch digital products:", error);
      setDigitalProductsError("Failed to load digital products.");
    } finally {
      setDigitalProductsLoading(false);
    }
  };

  async function getSubscription() {
    try {
      const token = await getToken();
      const response = await fetch(
        `${api_url}/customer-portal/subscriptions/${subscription_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("subscription data", data);
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  }

  return (
    <Card className="p-6">
      <CardContent className="flex flex-row justify-between px-0 gap-2">
        <div className="flex flex-row items-start gap-2">
          {product.product_image && (
            <Image
              src={product.product_image}
              alt={product.product_name}
              width={64}
              height={64}
              className="rounded-lg flex-none aspect-square object-cover"
            />
          )}
          <div className="flex flex-col gap-2">
            <CardTitle className="font-display font-semibold text-base leading-5 flex-none">
              {product.product_name}
            </CardTitle>
            <CardDescription className="font-body font-normal text-sm leading-[21px] text-text-secondary self-stretch">
              <ProductMarkdownDescription
                description={product.product_description}
              />
            </CardDescription>
          </div>
        </div>
        <div className="font-display font-semibold text-base leading-5 flex-none">
          {formatCurrency(
            decodeCurrency(product.price, product.currency as CurrencyCode),
            product.currency as CurrencyCode
          )}
        </div>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex flex-row justify-between p-0">
        {!product.is_subscription && product.quantity > 0 && (
          <div className="flex flex-row gap-2">
            <p className="text-sm text-text-secondary">
              QTY: {product.quantity}
            </p>
          </div>
        )}
        {subscription && renderSubscriptionBadges(subscription)}
        <div className="flex flex-row gap-2">
          {product.license_keys.length > 0 && (
            <LicenseSheets
              isLicenseSheetOpen={isLicenseSheetOpen}
              setIsLicenseSheetOpen={setIsLicenseSheetOpen}
              licenseKeys={product.license_keys}
            />
          )}
          {product.digital_product_deliverable && (
            <AttachmentsSheet
              isAttachmentsSheetOpen={isAttachmentsSheetOpen}
              setIsAttachmentsSheetOpen={setIsAttachmentsSheetOpen}
              digitalProductsLoading={digitalProductsLoading}
              digitalProducts={digitalProducts}
              error={digitalProductsError}
            />
          )}
          {product.is_subscription && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                router.push(`/session/subscriptions/${subscription_id}`)
              }
            >
              Manage Subscription
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
