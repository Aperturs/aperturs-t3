import OpenAI from "openai";
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

  // Split the content into individual strings using a regex pattern
  const strings = content.match(/"[^"]+"/g);

  // Remove the surrounding double quotes from each string
  const cleanedStrings = strings?.map((str) => str.slice(1, -1));

  return cleanedStrings || [];
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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // const promptTemp = PromptTemplate.fromTemplate(promptMessage);
  // const chainA = new LLMChain({ llm: model, prompt: promptTemp });
  // const resA = await chainA.run({ maxTokens: 100, stop: ["\n"] });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${promptMessage}` }],
    n: 1,
    temperature: 0.5,
    frequency_penalty: 0.2,
    presence_penalty: 0.0,
    // stream: true
  });
  console.log(response.usage,"total tokens");
  const endResponse = response.choices[0]?.message.content;
  console.log(endResponse)

  return convertStringToArray(endResponse || "");
}
