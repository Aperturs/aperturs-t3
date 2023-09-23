export interface IPrompt {
  ProjectName: string;
  ProjectDescription: string;
  ProjectContext: string;
  CommitInformation: string;
  website?: string;
}

export const systemPrompt = () => {
  return `
    Generate four engaging tweets about a project using GitHub commit messages. 
    Each tweet should be up to 280 characters in length and should be important, informative,
     and fun to read.
     The desired tone should be slightly clickbait, direct, sarcastic, and exciting, 
     but it should not resemble bot-generated content. Focus on the concept of launching new features.

1. The key element of each tweet should depend on commit messages or commit information. 
For each tweet, use a maximum of two emojis. Do add hashtags to tweet
2. Ensure there are line breaks in each tweet to make it look like a paragraph. Use "\\n" for line breaks.
3. your whole tweet is importantly dependent on commit message, so give it high priority

Output Format:
- Provide four distinct variations as an array: ["result1", "result2", "result3", "result4"]. This is crucial.
- Each tweet can consist of 1 to 3 small paragraphs with concise sentences.

Important Notes:
- Please adhere to all the instructions mentioned in this prompt to ensure successful completion.
- Failure to follow the instructions may result in an unsatisfactory output.
- Avoid using hashtags in the generated tweets.


Ensure that you maintain the structure and organization provided in this prompt to get the desired results.
`;
};

export const prompting = () => {
  return `
  Generate four engaging feature update tweets using GitHub commit messages or commit information as the key element. Each tweet should be up to 280 characters in length and should strike a balance between importance, informativeness, and a fun-to-read tone. The desired tone should be slightly clickbait, direct, sarcastic, and exciting, while avoiding the appearance of bot-generated content. Focus on the concept of launching new features.

For each tweet:

Incorporate a maximum of two emojis.
Ensure there are line breaks to create a paragraph-like appearance in each tweet, using "\n" for line breaks.
Emphasize the use of commit messages or commit information as the basis for each tweet, giving it high priority.
Avoid using hashtags in the generated tweets.
Output Format:

Provide four distinct variations as an array: ["result1", "result2", "result3", "result4"]. This is crucial.
Each tweet can consist of 1 to 3 small paragraphs with concise sentences.
Important Notes:

Please adhere to all the instructions mentioned in this prompt to ensure successful completion.
Failure to follow the instructions may result in an unsatisfactory output.
Ensure that you maintain the structure and organization provided in this prompt to get the desired results`
}
export const promptuser = ({
  ProjectName,
  ProjectDescription,
  ProjectContext,
  CommitInformation,
  website,
}: IPrompt) => {
  return `
  Generate four engaging tweets about a project using GitHub commit messages. 
    Each tweet should be up to 280 characters in length and should be important, informative,
   and fun to read.
   
   1. In the first paragraph, create a catchy header or hook that draws the reader in.   
   2. In the second paragraph, provide an overview of the new features or improvements, 
   3. presenting them in bullet points for clarity. Keep the tone enthusiastic and upbeat and keep it a little detailed and entertainting.
   4. In the third paragraph, highlight the quality of life improvement and express gratitude to ${ProjectContext}, 
   mentioning their brilliant feature request.
   5. Ensure each tweet is divided into two to three paragraphs with no more than one sentence per paragraph.
   dont use hashtags, just dont add any hashtags please in the generated tweets or any tweet.
   for line breaks use \\n
   make sure you break lines

Output Format:
- Provide four distinct variations as an array: ["result1", "result2", "result3", "result4"]. This is crucial.
- Each tweet can consist of 1 to 3 small paragraphs with concise sentences.

  Additional Information:
  Project Name: ${ProjectName}
  Description: ${ProjectDescription}
  Context: ${ProjectContext}
  Website: ${website ? website : "No website provided"}
  Commit Messages or Pull Requests Information: ${CommitInformation}

  Important Notes:
  - Please adhere to all the instructions mentioned in this prompt to ensure successful completion.
  - Failure to follow the instructions may result in an unsatisfactory output.
  - Avoid using hashtags in the generated tweets.
  
  Ensure that you maintain the structure and organization provided in this prompt to get the desired results.

  `
}

export const prompt = ({
  ProjectName,
  ProjectDescription,
  ProjectContext,
  CommitInformation,
  website,
}: IPrompt) => {
  return `
  Generate four so end array should contain 4 tweets engaging feature update tweets for ${ProjectName} using GitHub commit messages or
   commit information as the key element. Each tweet should be up to 280 characters in 
   length and should strike a balance between importance, informativeness, and a fun-to-read tone. 
   The desired tone should be slightly clickbait, direct, sarcastic, and exciting, 
  while avoiding the appearance of bot-generated content. Focus on the concept of launching new features.
  In each tweet:
  In the first paragraph, create a catchy header or hook that draws the reader in.   
  In the second paragraph, provide an overview of the new features or improvements, 
  presenting them in bullet points for clarity. Keep the tone enthusiastic and upbeat and keep it a little detailed and entertainting.
  In the third paragraph, highlight the quality of life improvement and express gratitude to ${ProjectContext}, 
  mentioning their brilliant feature request.
  Ensure each post is divided into two to three paragraphs with no more than one sentence per paragraph.
  dont use hashtags in the generated tweets or any tweet.
  for line breaks use whitespaces

  Additional Information:
  Project Name: ${ProjectName}
  Description: ${ProjectDescription}
  Context: ${ProjectContext}
  Website: ${website ? website : "No website provided"}
  Commit Messages or Pull Requests Information: ${CommitInformation}

  Output Format:
- Provide four distinct variations as an array: 
  ["result1", "result2", "result3", "result4"]. This is crucial. 
  so here result it your tweet
  Important Notes:

Please adhere to all the instructions mentioned in this prompt to ensure successful completion.
Failure to follow the instructions may result in an unsatisfactory output.
Ensure that you maintain the structure and organization provided in this prompt to get the desired results.

  `
}
