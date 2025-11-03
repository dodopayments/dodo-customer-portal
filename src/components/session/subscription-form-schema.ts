import { z } from "zod";

export const billingDetailsFormSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  country: z.string().min(1),
  addressLine: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  taxId: z.string().optional(),
});

export type BillingDetailsFormValues = z.infer<typeof billingDetailsFormSchema>;
