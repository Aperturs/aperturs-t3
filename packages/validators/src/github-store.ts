import { z } from "zod";

export const commitSchema = z.object({
  id: z.number(),
  message: z.string(),
  author: z.string(),
  date: z.string(),
});

export type CommitType = z.infer<typeof commitSchema>;
