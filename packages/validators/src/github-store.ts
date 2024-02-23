import { z } from "zod";

export const commitSchema = z.object({
  id: z.number(),
  message: z.string(),
  author: z.string(),
  date: z.string(),
});

export type Commit = z.infer<typeof commitSchema>;
