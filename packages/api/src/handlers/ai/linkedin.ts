import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import OpenAI from "openai";
import { z } from "zod";

import type { PersonalPreferenceType } from "@aperturs/validators/personalization";
import { db, eq, schema } from "@aperturs/db";

// import { preferenceOptions } from "@aperturs/validators/personalization";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
}: {
  userDetails: PersonalPreferenceType;
}) => {
  const prompt = `generate linkedin post based on user details to post content on linkedin ${convertPersonalPreferencesToText(userDetails)}

  here are few points to remember for posting
  1. make sure the hook is cool and clickbaity so it leads users to click on the post
  2. add some pointer emojis when needed and dont add hashtags
  `;

  console.log(prompt, "prompt");

  const { text } = await generateText({
    model: openai("ft:gpt-4o-mini-2024-07-18:aperturs:linked-exp-1:A2tb5FuW"),
    prompt: prompt,
  });
  console.log(text, "text");
  try {
    const response = await openAi.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:aperturs:linked-exp-1:A2tb5FuW",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message.content ?? "";
    const usage = response.usage;

    console.log(text, "text");
    return { text, usage };
  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    throw error;
  }
};

export const generateIdeas = async ({
  userDetails,
}: {
  userDetails: PersonalPreferenceType;
}) => {
  const { object, usage } = await generateObject({
    model: openai("ft:gpt-4o-mini-2024-07-18:aperturs:linked-exp-1:A2tb5FuW"),
    system: `you are ${convertPersonalPreferencesToText(userDetails)}
  `,
    prompt: `generate idea based on user details to post content on linkedin`,
    schema: z
      .object({
        idea: z.array(z.string()),
      })
      .describe("generate ideas based on user details"),
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
  const { text } = await generateLinkedinPost({
    userDetails,
  });
  return { text };
};

export function convertPersonalPreferencesToText(
  input: PersonalPreferenceType,
): string {
  // Destructure the input
  const { subTopics, linkedinContentOptions } = input;

  // Convert subtopics to text
  const subTopicsText =
    subTopics.length > 0
      ? `An expert in the following ${subTopics.map((subTopic) => subTopic.label).join(", ")}. the post should keep that in mind and generate it from that perspective`
      : "You haven't specified any subtopics.";

  // Convert LinkedIn content options to text

  const whatToPostText =
    linkedinContentOptions.whatToPost &&
    linkedinContentOptions.whatToPost?.length > 0
      ? `share about ${linkedinContentOptions.whatToPost?.map((topic) => topic.label).join(", ")}. so make sure you generate content that actually meet his goals`
      : "You haven't specified what you like to post about.";

  const reasonsForPostingText = `share content on LinkedIn because wants to ${linkedinContentOptions.reasonsForPosting?.map((topic) => topic.label).join(", ")}. as make sure the output is taking care his goals`;

  const toneOfVoiceText = `tone of voice is ${linkedinContentOptions.toneOfVoice?.map((topic) => topic.label).join(", ")}.`;

  const yourPositionText = `person's position is ${linkedinContentOptions.yourPosition?.map((topic) => topic.label).join(", ")}.`;

  // Convert preferences to text
  const preferencesText = "Here are more details about your preferences:";

  const fullText = `${subTopicsText},${whatToPostText},${reasonsForPostingText},${toneOfVoiceText},${yourPositionText},${preferencesText}\n`;

  return fullText;
}

export const generateLinkedinPostBasedOnTopic = async function* (
  topic: string,
  currentUser: string,
) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.clerkUserId, currentUser),
  });
  const userDetails = user?.personalization as PersonalPreferenceType;
  const prompt = `generate linkedin post based on user details to post content on linkedin ${convertPersonalPreferencesToText(userDetails)}
    on the topic of ${topic}
here are few points to remember for posting
  1. make sure the hook is cool and clickbaity so it leads users to click on the post
  2. add some pointer emojis when needed 
  make sure the whole post actually makes sense and is meaningful, instead of generating random content
  3. dont giveout any links, or talk about video or image or articles
  4. when talking about userful dont halusinate or talk about any fake things, your basic details are given above
  5. dont use "*" these kind of symbols
  6. dont use any hashtags

  remember all the points
  `;

  console.log(prompt, "prompt");

  const stream = await openAi.chat.completions.create({
    model: "ft:gpt-4o-mini-2024-07-18:aperturs:linked-exp-1:A2tb5FuW",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    // temperature: 0.4,
    frequency_penalty: 0.5,
    stream_options: {
      include_usage: true,
    },
    max_tokens: 3000,
  });

  let fullContent = "";
  let fullUsage = 0;
  for await (const chunk of stream) {
    const targetIndex = 0;
    const target = chunk.choices[targetIndex];
    const content = target?.delta?.content ?? "";
    const usage = chunk.usage?.total_tokens ?? 0;
    yield content;
    fullUsage += usage;
    fullContent += content;
  }

  console.log({ fullContent, fullUsage });
};
