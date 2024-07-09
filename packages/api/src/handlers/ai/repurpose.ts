import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const generateSocialMediaPost = async (idea: string) => {
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: `create social media post based on this idea: ${idea}`,
    schema: z.object({
      linkedin: z
        .string()
        .describe(
          "based on the idea create a linkedin post that sounds interesting and engaging, also add some fun components to it.",
        ),
      twitter: z.array(z.string()).describe(
        `create a twitter thread post make sure to generate multiple tweets if needed, make sure each
           tweet has good content, and is not too long nor too short, min of 
           100 characters and max of 250 characters`,
      ),
    }),
  });
  console.log(result);
  return result;
};
