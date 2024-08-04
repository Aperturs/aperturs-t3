import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";


export const generateSocialMediaPost = async (idea: string) => {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: `create social media post based on this idea make sure its funny and detailed make sure you put some line breaks as well and most important part dont ever add hashtags: ${idea}`,
    schema: z.object({
      linkedin: z
        .string()
        .describe(
          "based on the idea create a linkedin post that sounds interesting and engaging, also add some fun components to it. make sure its comprehensive please keep it good length and describe everything in detail and point wise with paragraph breaks",
        ),
      twitter: z.array(z.string()).describe(
        `create a twitter thread post make sure to generate multiple tweets if needed, make sure each
           tweet has content of decent length, and is not too long nor too short, min of 
           100 characters and max of 250 characters. keep the tweets engaging, detailed (more important) and fun.`,
      ),
    }),
  });
  console.log(result, "ai generated");
  return result;
};
