import { z } from "zod";

export const ProjectQnASchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type ProjectQnA = z.infer<typeof ProjectQnASchema>;
