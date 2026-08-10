"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { api, api_url } from "@/lib/http";
import { getSessionToken } from "@/app/session/subscriptions/[id]/action";
import { getErrorMessage } from "@/lib/clientErrorHelper";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { InvoiceDetailsPayload } from "@/app/session/subscriptions/[id]/types";

async function updateInvoiceDetails(
  paymentId: string,
  payload: InvoiceDetailsPayload,
): Promise<void> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  await api.patch<InvoiceDetailsPayload>(
    `/customer-portal/payments/${paymentId}/invoices`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

interface InvoiceFillDetailsProps {
  paymentId: string;
  onDownloadComplete?: () => void;
}

export function InvoiceFillDetails({
  paymentId,
  onDownloadComplete,
}: InvoiceFillDetailsProps) {
  const t = useTranslations("InvoiceFillDetails");
  const [address, setAddress] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blockedInvoiceUrl, setBlockedInvoiceUrl] = useState<string | null>(
    null,
  );

  /**
   * Only the fields the customer actually filled in are sent.
   *
   * A blank field is omitted from the body entirely instead of being sent as
   * `null`. The API treats an explicit `null` as "change this value", and for
   * countries where the zipcode determines tax it rejects any change to the
   * zipcode captured at checkout with INVALID_REQUEST_PARAMETERS. Omitting the
   * key leaves the stored value untouched.
   */
  const payload = useMemo<InvoiceDetailsPayload>(() => {
    const fields: Array<[keyof InvoiceDetailsPayload, string]> = [
      ["street", address],
      ["state", state],
      ["city", city],
      ["zipcode", postalCode],
    ];

    return fields.reduce<InvoiceDetailsPayload>((acc, [key, value]) => {
      const trimmed = value.trim();
      if (trimmed !== "") {
        acc[key] = trimmed;
      }
      return acc;
    }, {});
  }, [address, state, city, postalCode]);

  const hasChanges = Object.keys(payload).length > 0;

  /**
   * The invoice renders in a new tab, so the flow is only complete once that
   * tab actually opened.
   *
   * If it was blocked, the address update itself still succeeded, so the sheet
   * stays open and offers a direct link instead. Closing it here would leave
   * the customer with no invoice and no way back other than restarting the
   * whole flow.
   */
  const finishDownload = (opened: boolean, invoiceUrl: string) => {
    if (opened) {
      toast.success(t("downloadSuccess"));
      onDownloadComplete?.();
      return;
    }

    toast.warning(t("popupBlocked"));
    setBlockedInvoiceUrl(invoiceUrl);
  };

  const handleDownload = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setBlockedInvoiceUrl(null);

    const invoiceUrl = `${api_url}/invoices/payments/${paymentId}`;

    // Nothing was filled in, so there is nothing to update. Open the invoice
    // synchronously to stay inside the user gesture and avoid a needless
    // request that could only fail.
    if (!hasChanges) {
      const opened = window.open(invoiceUrl, "_blank");
      setIsSubmitting(false);
      finishDownload(Boolean(opened), invoiceUrl);
      return;
    }

    // Reserve the tab before awaiting. Calling window.open() after the PATCH
    // resolves happens outside the user gesture and is liable to be blocked.
    const invoiceWindow = window.open("", "_blank");

    try {
      await updateInvoiceDetails(paymentId, payload);

      let opened = false;
      if (invoiceWindow && !invoiceWindow.closed) {
        invoiceWindow.location.href = invoiceUrl;
        opened = true;
      }

      finishDownload(opened, invoiceUrl);
    } catch (error) {
      invoiceWindow?.close();
      // Surfaced inline rather than as a toast so the sheet stays open and the
      // customer keeps everything they typed.
      setErrorMessage(getErrorMessage(error, t("updateFailed")).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0 rounded-xl border border-border-secondary">
        <div className="border-border-secondary">
          <Input
            className="rounded-b-none focus-visible:relative focus-visible:z-20"
            type="text"
            placeholder={t("addressLine")}
            value={address}
            disabled={isSubmitting}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="border-border-secondary">
          <Input
            className="rounded-none border-y-0 focus-visible:relative focus-visible:border-t focus-visible:z-20"
            type="text"
            placeholder={t("state")}
            value={state}
            disabled={isSubmitting}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-0 border-t border-border-secondary">
          <div>
            <Input
              className="rounded-none rounded-bl-lg focus-visible:relative focus-visible:border-y focus-visible:z-20"
              type="text"
              placeholder={t("city")}
              value={city}
              disabled={isSubmitting}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <Input
              className="rounded-none rounded-br-lg border-l-0 focus-visible:relative focus-visible:border-y focus-visible:border-l focus-visible:z-20"
              type="text"
              placeholder={t("postalCode")}
              value={postalCode}
              disabled={isSubmitting}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-text-secondary">{t("blankFieldsHint")}</p>

      {errorMessage && (
        <p className="text-sm text-text-error-primary" role="alert">
          {errorMessage}
        </p>
      )}

      {blockedInvoiceUrl && (
        // A real click on an anchor is never pop-up blocked, so this always
        // gets the customer their invoice without repeating the update.
        <Button asChild variant="secondary" className="w-full">
          <a
            href={blockedInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onDownloadComplete?.()}
          >
            <Download className="w-4 h-4 mr-2" />
            {t("openInvoice")}
          </a>
        </Button>
      )}

      <div className="flex mt-4">
        <Button
          className="w-full"
          variant="default"
          loading={isSubmitting}
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          {t("download")}
        </Button>
      </div>
    </div>
  );
}

export default InvoiceFillDetails;
