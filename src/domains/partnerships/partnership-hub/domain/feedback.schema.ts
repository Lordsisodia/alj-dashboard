import { z } from "zod";

export const FeedbackSchema = z.object({
  email: z.string().min(1, "Valid email required").email({ message: "Valid email required" }),
  topic: z.string().min(3, "Topic is required"),
  message: z.string().min(10, "Please add at least 10 characters"),
});

export type FeedbackPayload = z.infer<typeof FeedbackSchema>;
