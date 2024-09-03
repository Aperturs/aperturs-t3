import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";

import type { PersonalPreferenceType } from "@aperturs/validators/personalization";
import { preferenceOptions } from "@aperturs/validators/personalization";

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

export const generateLinkedinPost = async ({
  userDetails,
  idea,
}: {
  idea: string | string[];
  userDetails: PersonalPreferenceType;
}) => {
  let prompt = "";
  if (typeof idea === "string") {
    prompt = `generate linkedin post based on this idea make sure its funny and detailed make sure you put some line breaks as well and most important part: ${idea}`;
  } else {
    prompt = `generate linkedin post based on this idea make sure its funny and detailed make sure you put some line breaks as well and most important part
      create post picking the best idea from the list: ${idea.map((i) => i).join(" ")}
      `;
  }
  const { text, usage } = await generateText({
    model: openai("ft:gpt-4o-mini-2024-07-18:aperturs:linked-exp-1:A2tb5FuW"),
    system: `You are a Professional linkedin content writer here are some user details that you can use to create the post: ${convertPersonalPreferencesToText(
      userDetails,
    )} remember hashtag and emoji preferences`,
    prompt: `${prompt} 
      `,
  });
  return { text, usage };
};

export const generateIdeas = async ({
  userDetails,
}: {
  userDetails: PersonalPreferenceType;
}) => {
  const { object, usage } = await generateObject({
    model: openai("gpt-4o-mini"),
    system: `you are ${convertPersonalPreferencesToText(userDetails)}
    remember emoji and hastag preferences,
    `,
    prompt: `
    generate idea based on user details, make sure they are funny and engaging, make sure they are detailed and comprehensive
    
    `,
    schema: z.object({
      idea: z.string(),
    }),
  }).catch((e) => {
    console.error(e);
    throw new Error("Failed to generate ideas");
  });
  return { object, usage };
};

export const generatePostDirectly = async ({
  userDetails,
}: {
  userDetails: PersonalPreferenceType;
}) => {
  const ideas = await generateIdeas({ userDetails });
  const { text } = await generateLinkedinPost({
    idea: ideas.object.idea,
    userDetails,
  });
  console.log(ideas, "ideas");
  console.log(text, "text");
  return { text, ideas };
};

export function convertPersonalPreferencesToText(
  input: PersonalPreferenceType,
): string {
  // Destructure the input
  const { subTopics, linkedinContentOptions, preferences } = input;

  // Convert subtopics to text
  const subTopicsText =
    subTopics.length > 0
      ? `You are an expert in the following subtopics: ${subTopics.map((subTopic) => subTopic.label).join(", ")}.`
      : "You haven't specified any subtopics.";

  // Convert LinkedIn content options to text
  let linkedinContentText = "Your preferences include:";
  for (const [key, subtopics] of Object.entries(linkedinContentOptions)) {
    linkedinContentText += `\n- ${key}: ${subtopics.map((subTopic) => subTopic.label).join(", ")}`;
  }

  // Convert preferences to text
  const preferencesText = "Here are more details about your preferences:";
  const preferenceDetails = Object.entries(preferences)
    .map(([key, preference]) => {
      const preferenceOption = preferenceOptions.find(
        (option) => option.key === key,
      );
      return preferenceOption
        ? `${preferenceOption.title}: ${preference}`
        : `${key}: ${preference}`;
    })
    .join(", ");

  // Combine all the text parts into a single output
  const fullText = `${subTopicsText}\n\n${linkedinContentText}\n\n${preferencesText}\n${preferenceDetails}`;

  return fullText;
}
