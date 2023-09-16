
export interface IPrompt{
    ProjectName: string;
    ProjectDescription: string;
    ProjectContext: string;
    CommitInformation: string;
    website?: string;
  }

export const prompt = ({ProjectName, ProjectDescription, ProjectContext, CommitInformation,website}: IPrompt) => {
    return `
    Generate engaging "feature update or new feature" style tweets based on commit messages from GitHub for the provided project. 
    Each tweet should be informative, insightful, and up to 280 characters. Context about the app and commit messages will be provided. 
    
    The aim is to create 4 distinct variations for each set of input data, formatted as an array:
    ["result1", "result2", "result3", "result4'"]
    just this output format

    Desired Output Format:

    Each tweet should be list of small paragraphs with all overall text consisting of up to 280 characters.
    you can increase the length of the tweet if you want
    so basically you can create 1 to 3 paragraphs with small sentences ( important remember this )
    
    Maintain concise, informative, and engaging content and fun.
    Avoid  hashtags, or other distractions.
    Add Emojis if needed
    The tone should be a little click bait direct little sarcasm, and can be little fun and exiting 
    and should not resemble a bot-generated tweet.
    

    Topics to Focus On:

    Building in public
    (most important): Launching new features
    Additional Notes:
    
    Incorporate the "build in public" concept when relevant.
 
    Project Details:
    
    Project Name: ${ProjectName}
    Description: ${ProjectDescription}
    Context: ${ProjectContext}
    Website: ${website ? website : "No website provided"}
    Commit Messages or Pull Requests Information: ${CommitInformation}
    Generate four variations of tweets based on the provided project details and commit messages.
    `
}