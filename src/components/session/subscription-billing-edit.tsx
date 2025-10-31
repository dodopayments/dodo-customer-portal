"use client";

import { useEffect, useState } from "react";
import { SubscriptionDetailsData } from "@/app/session/subscriptions/[id]/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { CountriesList, CountriesListType } from "@/constants/Countries";
import { fetchSupportedCountries, getMatchedCountries } from "@/components/session/subscription-utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "../ui/checkbox";
import { BillingDetailsFormValues } from "./subscription-form-schema";
import { updateBillingDetails } from "@/app/session/subscriptions/[id]/action";
import { toast } from "sonner";

interface SubscriptionBillingEditProps {
  subscription: SubscriptionDetailsData;
  onClose?: () => void;
}

export default function SubscriptionBillingEdit({ subscription, onClose }: SubscriptionBillingEditProps) {
  const [countries, setCountries] = useState<CountriesListType[]>([]);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState<string>(subscription.customer.name || "");
  const [email, setEmail] = useState<string>(subscription.customer.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(subscription.customer.phone_number || "");
  const [country, setCountry] = useState<string>(subscription.billing.country || "");
  const [addressLine, setAddressLine] = useState<string>(subscription.billing.street || "");
  const [state, setState] = useState<string>(subscription.billing.state || "");
  const [city, setCity] = useState<string>(subscription.billing.city || "");
  const [postalCode, setPostalCode] = useState<string>(subscription.billing.zipcode || "");
  const [taxId, setTaxId] = useState<string>(subscription.tax_id || "");
  const [isBusiness, setIsBusiness] = useState<boolean>(subscription.tax_id ? true : false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsLoadingCountry(true);
      const countryCodes = await fetchSupportedCountries();
      const matchedCountries = await getMatchedCountries(countryCodes, CountriesList);
      setCountries(matchedCountries);
      setIsLoadingCountry(false);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const onSave = async (data: BillingDetailsFormValues) => {
    try {
      const response = await updateBillingDetails({
        subscription_id: subscription.subscription_id,
        data: {
          customer: {
            name: data.fullName,
            email: data.email,
            phone_number: data.phoneNumber,
          },
          billing: {
            city: data.city,
            country: data.country,
            state: data.state,
            street: data.addressLine,
            zipcode: data.postalCode,
          },
          tax_id: data.taxId || null,
        },
      });
      console.log("response", response);
      toast.success("Billing details updated successfully");
    } catch (error) {
      console.error("Failed to update billing details:", error);
      toast.error("Failed to update billing details. Please try again.");
    }
    if (onClose) onClose();
    setOpen(false);
  };

  const onCancel = () => {
    if (onClose) onClose();
    setOpen(false);
  };

  const form = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Customer Name</Label>
        <Input id="fullName" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input disabled={true} id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input disabled={true} id="phoneNumber" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label> Billing Address </Label>
        <div className="space-y-0 rounded-xl border border-border-secondary">
          <SelectNative
            className="rounded-b-none shadow-none focus-visible:relative focus-visible:z-20"
            disabled={isLoadingCountry}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {isLoadingCountry ? (
              <option value="">Loading...</option>
            ) : (
              countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))
            )}
          </SelectNative>

          <div className="border-t border-border-secondary">
            <Input
              className="rounded-t-none rounded-b-none border-t-0 focus-visible:relative focus-visible:border-t focus-visible:z-20"
              placeholder="Address line 1"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
            />
          </div>

          <div className="border-t border-border-secondary">
            <Input
              className="rounded-t-none border-y-0 rounded-b-none focus-visible:relative focus-visible:border-t focus-visible:z-20"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-0 border-t border-border-secondary">

            <Input
              className="rounded-none rounded-bl-lg focus-visible:relative focus-visible:border-y focus-visible:z-20"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />


            <Input
              className="rounded-none rounded-br-lg border-l-0  focus-visible:relative focus-visible:border-y focus-visible:border-l focus-visible:z-20"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />

          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Checkbox
          id="isBusiness"
          checked={isBusiness}
          onCheckedChange={(checked) => setIsBusiness(checked === true)}
        />
        <Label htmlFor="isBusiness">Purchasing as a business</Label>
      </div>

      {isBusiness && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input id="taxId" placeholder="Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
        </div>
      )}

      <div className="flex flex-row gap-2 mt-4">
        <Button variant="default" className="w-full" onClick={() => onSave({ fullName, email, phoneNumber, country, addressLine, state, city, postalCode, ...(isBusiness ? { taxId } : {}) })} disabled={isLoading}>Save Details</Button>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle className="text-left font-['Hanken_Grotesk'] font-semibold text-base leading-tight tracking-normal">Edit Billing Details</SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        {form}
      </SheetContent>
    </Sheet>
  );
}


