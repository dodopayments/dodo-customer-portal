"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Receipt } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CountriesList, CountriesListType } from "@/constants/Countries";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { SelectNative } from "../ui/select-native";

import {
  fetchSupportedCountries,
  getMatchedCountries,
} from "./subscription-utils";
import {
  billingDetailsFormSchema,
  BillingDetailsFormValues,
} from "./subscription-form-schema";
import { SubscriptionResponse } from "@/redux/slice/subscription/subscriptoinSlice";

interface BillingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  initialData: SubscriptionResponse;
  onSubmit: (data: BillingDetailsFormValues) => void;
  isLoading?: boolean;
}

export function BillingDetailsDialog({
  open,
  onOpenChange,
  subscriptionId,
  initialData,
  onSubmit,
  isLoading = false,
}: BillingDetailsDialogProps) {
  const [countries, setCountries] = useState<CountriesListType[]>([]);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);
  const [checked, setChecked] = useState(false);

  const form = useForm<BillingDetailsFormValues>({
    resolver: zodResolver(billingDetailsFormSchema),
    defaultValues: {
      fullName: initialData.customer.name,
      country: initialData.billing.country,
      addressLine: initialData.billing.street,
      state: initialData.billing.state,
      city: initialData.billing.city,
      postalCode: initialData.billing.zipcode,
      taxId: initialData.tax_id || "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: initialData.customer.name,
      country: initialData.billing.country,
      addressLine: initialData.billing.street,
      state: initialData.billing.state,
      city: initialData.billing.city,
      postalCode: initialData.billing.zipcode,
      taxId: initialData.tax_id || "",
    });
  }, [initialData, form, open]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCountry(true);
      const countryCodes = await fetchSupportedCountries();
      const matchedCountries = await getMatchedCountries(
        countryCodes,
        CountriesList
      );
      setCountries(matchedCountries);
      setIsLoadingCountry(false);
    };
    fetchData();
  }, []);

  const handleSubmit = (data: BillingDetailsFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-[95vw] rounded-lg sm:max-w-[480px]"
      >
        <DialogHeader className="mb-3 space-y-0">
          <div className="bg-bg-secondary p-3 w-fit h-fit rounded-full">
            <Receipt className="w-6 h-6" />
          </div>
          <DialogTitle className="pt-4">
            Edit billing details - {subscriptionId || "Subscription"}
          </DialogTitle>
          <DialogDescription>
            Any changes will be reflected from the next recurring payment
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-0">
              {/* Full Name */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="fullName">Full Name</Label>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="fullName"
                          placeholder="Full Name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectNative
                          className={`rounded-b-none shadow-none focus-visible:relative focus-visible:z-20 ${
                            form.formState.errors.country &&
                            "border-border-error"
                          }`}
                          {...field}
                          disabled={isLoadingCountry || isLoading}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          {isLoadingCountry ? (
                            <option value="">Loading...</option>
                          ) : (
                            countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))
                          )}
                        </SelectNative>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="addressLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn(
                            "rounded-t-none rounded-b-none border-t-0 focus-visible:relative focus-visible:border-t focus-visible:z-20",
                            form.formState.errors.addressLine &&
                              "border-border-error focus-visible:border-border-error"
                          )}
                          placeholder="Address line 1"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn(
                            "rounded-t-none border-y-0 rounded-b-none focus-visible:relative focus-visible:border-t focus-visible:z-20",
                            form.formState.errors.state &&
                              "border-border-error focus-visible:border-border-error"
                          )}
                          placeholder="State"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-0">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn(
                            "rounded-none rounded-bl-lg focus-visible:relative focus-visible:border-y focus-visible:z-20",
                            form.formState.errors.city &&
                              "border-border-error focus-visible:border-border-error"
                          )}
                          placeholder="City"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn(
                            "rounded-none rounded-br-lg border-l-0  focus-visible:relative focus-visible:border-y focus-visible:border-l focus-visible:z-20",
                            form.formState.errors.postalCode &&
                              "border-border-error focus-visible:border-border-error"
                          )}
                          placeholder="Postal code"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Purchasing as a business checkbox */}
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="isBusinessPurchase"
                  className="mt-[0px]"
                  checked={checked}
                  disabled={isLoading}
                  onCheckedChange={(state) => {
                    setChecked(state === true);
                    form.setValue("taxId", "");
                  }}
                />

                <Label
                  htmlFor="isBusinessPurchase"
                  className="text-sm font-normal"
                >
                  Purchasing as a business
                </Label>
              </div>

              {/* Tax ID Number - only visible if purchasing as business */}
              {checked && (
                <div className="pt-4 space-y-2">
                  <Label htmlFor="taxId">Tax ID Number</Label>
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="taxId"
                            placeholder="Tax ID Number"
                            className={cn(
                              form.formState.errors.taxId &&
                                "border-border-error focus-visible:border-border-error"
                            )}
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 flex flex-row pt-4 w-full sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Close
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
