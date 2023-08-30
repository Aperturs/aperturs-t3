import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { env } from "~/env.mjs";
import { prompt, type IPrompt } from "./prompt";

function convertStringToArray(input: string): string[] {
  // Find the starting "[" and ending "]" positions
  const startIndex = input.indexOf("[");
  const endIndex = input.lastIndexOf("]");

  if (startIndex === -1 || endIndex === -1) {
    // Return an empty array if the input doesn't have the expected structure
    return [];
  }

  // Extract the content inside the square brackets
  const content = input.slice(startIndex + 1, endIndex);

  // Remove extra spaces and line breaks, and then split into individual strings
  const cleanedContent = content.replace(/\s+/g, " ").trim();
  const strings = cleanedContent.split('", ');

  // Remove the surrounding double quotes from each string
  const cleanedStrings = strings.map((str) => str.replace(/^"(.*)"$/, "$1"));

  return cleanedStrings;
}

export async function AIGenerated({
  ProjectName,
  ProjectContext,
  ProjectDescription,
  CommitInformation,
  website,
}: IPrompt) {
  const promptMessage = prompt({
    ProjectName,
    ProjectContext,
    ProjectDescription,
    CommitInformation,
    website,
  });
  const model = new OpenAI({
    temperature: 0.6,
    openAIApiKey: env.OPENAI_API_KEY,
  });
  const promptTemp = PromptTemplate.fromTemplate(promptMessage);
  const chainA = new LLMChain({ llm: model, prompt: promptTemp });
  const resA = await chainA.run({ maxTokens: 100, stop: ["\n"] });
  console.log(resA);
  return convertStringToArray(resA);
}
