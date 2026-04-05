// @ts-nocheck
import { z } from "zod";
import type { AccountField, TwoFactorAction } from "./types";
import { ACCOUNT_FIELD_VALIDATORS } from "./validators";

export const AccountFieldSchema: z.ZodType<AccountField> = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  helper: z.string().optional(),
  // LucideIcon is runtime-less; validate shape loosely
  icon: z.any(),
});

export const TwoFactorActionSchema: z.ZodType<TwoFactorAction> = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
});

export const AccountSettingsSchema = z.object({
  fields: z.array(AccountFieldSchema),
  twoFactorActions: z.array(TwoFactorActionSchema),
});

function validateFieldValue(field: AccountField) {
  const validator = ACCOUNT_FIELD_VALIDATORS[field.id];
  if (validator) {
    validator.parse(field.value);
  }
}

export type AccountSettingsParsed = z.infer<typeof AccountSettingsSchema>;

export function parseAccountSettings(data: unknown): AccountSettingsParsed {
  const parsed = AccountSettingsSchema.parse(data);
  parsed.fields.forEach(validateFieldValue);
  return parsed;
}
