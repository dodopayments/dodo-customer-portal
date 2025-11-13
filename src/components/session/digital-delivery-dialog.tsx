"use client";

import { useState } from "react";
import { DownloadSimple, Link as LinkIcon } from "@phosphor-icons/react";

interface DigitalProductResponse {
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { getToken } from "@/lib/server-actions";
import parseError from "@/lib/parseError";

interface DigitalDeliveryDialogProps {
  payment_id: string;
}

export function DigitalDeliveryDialog({
  payment_id,
}: DigitalDeliveryDialogProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<DigitalProductResponse[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      setIsPreloading(true);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const apiUrl =
          typeof window !== "undefined"
            ? window.location.hostname ===
              process.env.NEXT_PUBLIC_HOST_URL?.replace("https://", "")
              ? process.env.NEXT_PUBLIC_LIVE_URL
              : process.env.NEXT_PUBLIC_TEST_URL
            : process.env.NEXT_PUBLIC_TEST_URL;

        const response = await fetch(
          `${apiUrl}/customer-portal/payments/${payment_id}/digital-product-deliverables`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch digital products: ${response.status}`,
          );
        }

        const data = await response.json();
        setProducts(data.items || []);
        setOpen(true);
      } catch (error) {
        parseError(error, "Failed to load digital products. Please try again.");
      } finally {
        setIsPreloading(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" loading={isPreloading}>
          <LinkIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] rounded-lg sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Digital Products</DialogTitle>
          <DialogDescription>
            Access your purchased digital products and downloads
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {products.map((product, index) => (
              <div key={product.product_id} className="space-y-4">
                <div>
                  <h3 className="font-medium text-text-primary">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-text-tertiary mt-1">
                      {product.description}
                    </p>
                  )}
                </div>

                {product.deliverable.files && (
                  <div className="space-y-2">
                    {product.deliverable.files.map((file) => (
                      <Button
                        key={file.file_id}
                        variant="secondary"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DownloadSimple className="w-4 h-4 mr-2" />
                          {file.file_name}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {product.deliverable.external_url && (
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={product.deliverable.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Access External Resource
                    </a>
                  </Button>
                )}

                {product.deliverable.instructions && (
                  <div className="text-sm text-text-tertiary bg-bg-secondary p-3 rounded-md">
                    <p className="font-medium mb-1">Instructions:</p>
                    <p>{product.deliverable.instructions}</p>
                  </div>
                )}

                {index !== products.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default DigitalDeliveryDialog;
