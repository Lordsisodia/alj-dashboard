import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  social: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .partial()
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileUploadSchema = z.object({
  fileName: z.string(),
  size: z.number(),
  type: z.string(),
});

export type ProfileUpload = z.infer<typeof ProfileUploadSchema>;
