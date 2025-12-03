"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InvoiceFillDetailsProps {
  url: string;
}

export function InvoiceFillDetails({ url }: InvoiceFillDetailsProps) {
  const [address, setAddress] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0 rounded-xl border border-border-secondary">
        <div className="border-border-secondary">
          <Input
            className="rounded-b-none focus-visible:relative focus-visible:z-20"
            type="text"
            placeholder="Address line 1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="border-border-secondary">
          <Input
            className="rounded-none border-y-0 focus-visible:relative focus-visible:border-t focus-visible:z-20"
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-0 border-t border-border-secondary">
          <div>
            <Input
              className="rounded-none rounded-bl-lg focus-visible:relative focus-visible:border-y focus-visible:z-20"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <Input
              className="rounded-none rounded-br-lg border-l-0 focus-visible:relative focus-visible:border-y focus-visible:border-l focus-visible:z-20"
              type="text"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex mt-4">
        <Button
          className="w-full"
          variant="default"
          onClick={() => window.open(url, "_blank")}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}

export default InvoiceFillDetails;
