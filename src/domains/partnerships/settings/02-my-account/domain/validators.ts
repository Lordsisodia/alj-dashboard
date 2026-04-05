import { z } from "zod";

// Minimal per-field validators; keyed by field id
export const ACCOUNT_FIELD_VALIDATORS: Record<string, z.ZodTypeAny> = {
  "account-email": z.string().email("Invalid email"),
  "account-phone": z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/,
      "Phone must be E.164-ish (8-15 digits, optional +)")
    .optional(),
};
