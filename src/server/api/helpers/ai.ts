import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { prompt, type IPrompt } from "./prompt";
import { env } from "~/env.mjs";

function convertStringToArray(input: string): string[] {
  // Remove the surrounding square brackets and split the input string by commas
  const strings = input.slice(1, -1).split(", ");

  return strings;
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
  const model = new OpenAI({ temperature: 0.6,openAIApiKey: env.OPENAI_API_KEY });
  const promptTemp = PromptTemplate.fromTemplate(promptMessage);
  const chainA = new LLMChain({ llm: model, prompt: promptTemp });
  const resA = await chainA.run({ maxTokens: 100, stop: ["\n"] });
  return convertStringToArray(resA);
}
