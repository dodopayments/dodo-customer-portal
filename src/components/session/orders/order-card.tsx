"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { getBadge } from "@/lib/badge-helper";
import { Download } from "lucide-react";
import { api_url } from "@/lib/http";
import {
  CurrencyCode,
  formatCurrency,
  decodeCurrency,
} from "@/lib/currency-helper";
import { OrderData } from "./orders";
import { useState } from "react";
import { parseIsoDate } from "@/lib/date-helper";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { getProductCart } from "@/app/session/orders/actions";
import { Product, ProductCartItem } from "../product";
import parseError from "@/lib/parseError";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import InvoiceFillDetails from "../invoice-fill-details";

interface OrderCardProps {
  item: OrderData;
  cardClassName?: string;
}

export const OrderCard = ({ item, cardClassName }: OrderCardProps) => {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [productCart, setProductCart] = useState<ProductCartItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFillDetailsOpen, setIsFillDetailsOpen] = useState(false);

  // Fetch product cart for this order
  const fetchProductCart = async () => {
    try {
      const productCart = await getProductCart(item.payment_id);
      setProductCart(productCart);
    } catch (error) {
      parseError(error, "Failed to fetch product cart. Please try again.");
    }
  };

  const onToggleDetails = async () => {
    if (showDetails) {
      setShowDetails(false);
      return;
    }
    setLoading(true);
    await fetchProductCart();
    setLoading(false);
    setShowDetails(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setIsFillDetailsOpen(false);
    }
  };

  const handleDownloadComplete = () => {
    setIsSheetOpen(false);
    setIsFillDetailsOpen(false);
  };

  return (
    <Card
      className={`${cardClassName} cursor-pointer transition-colors`}
      onClick={onToggleDetails}
    >
      <CardContent className="flex flex-col px-0 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 w-full">
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-sm text-text-secondary">Payment ID</p>
            <CardTitle className="font-display font-semibold text-base leading-5 break-all">
              {item.payment_id}
            </CardTitle>
          </div>
          <div className="font-display font-semibold text-base leading-5 text-right sm:text-left shrink-0">
            {formatCurrency(
              decodeCurrency(item.total_amount, item.currency as CurrencyCode),
              item.currency as CurrencyCode,
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={getBadge(item.status).color as BadgeVariant}
            dot={false}
            className="rounded-sm border-sm"
          >
            {getBadge(item.status).message}
          </Badge>
          <p className="text-sm text-text-secondary">
            Purchased: {parseIsoDate(item.created_at)}
          </p>
        </div>
        <div
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Download />
                Invoice
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <SheetHeader>
                <SheetTitle
                  className="text-left font-display font-semibold text-base leading-tight tracking-normal"
                  style={
                    {
                      textBoxTrim: "trim",
                      textBoxEdge: "cap",
                    } as React.CSSProperties
                  }
                >
                  {isFillDetailsOpen
                    ? "Enter full address of customer"
                    : "Generate Invoice"}
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-3" />
              {isFillDetailsOpen ? (
                <InvoiceFillDetails
                  url={item.payment_id}
                  onDownloadComplete={handleDownloadComplete}
                />
              ) : (
                <>
                  <Card className="p-5">
                    <CardContent className="p-0">
                      <CardTitle
                        className="font-display font-medium text-sm tracking-normal"
                        style={
                          {
                            textBoxTrim: "trim",
                            textBoxEdge: "cap",
                          } as React.CSSProperties
                        }
                      >
                        Download with existing address details
                      </CardTitle>
                      <CardDescription
                        className="font-body font-normal text-xs leading-5 tracking-normal"
                        style={
                          {
                            textBoxTrim: "trim",
                            textBoxEdge: "cap",
                          } as React.CSSProperties
                        }
                      >
                        This invoice will include only your zip code and country
                        as provided during the checkout process.
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          window.open(
                            `${api_url}/invoices/payments/${item.payment_id}`,
                            "_blank",
                          );
                          handleDownloadComplete();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Invoice
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="p-5">
                    <CardContent className="p-0">
                      <CardTitle
                        className="font-display font-medium text-sm tracking-normal"
                        style={
                          {
                            textBoxTrim: "trim",
                            textBoxEdge: "cap",
                          } as React.CSSProperties
                        }
                      >
                        Download with full address details
                      </CardTitle>
                      <CardDescription
                        className="font-body font-normal text-xs leading-5 tracking-normal"
                        style={
                          {
                            textBoxTrim: "trim",
                            textBoxEdge: "cap",
                          } as React.CSSProperties
                        }
                      >
                        This invoice will include the complete address of the
                        customer. Please ensure you fill in all the details
                        before downloading.
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setIsFillDetailsOpen(true)}
                      >
                        Fill Details
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </SheetContent>
          </Sheet>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onToggleDetails}
            loading={loading}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </Button>
        </div>
      </CardFooter>
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent>
          <Separator className="my-4" />
          {productCart.length > 0 &&
            productCart.map((product) => (
              <Product
                key={product.product_id}
                payment_id={item.payment_id}
                subscription_id={item.subscription_id ?? null}
                product={product}
              />
            ))}
          {productCart.length === 0 && (
            <p className="text-sm text-text-secondary">
              No products in this order.
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
