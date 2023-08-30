
export interface IPrompt{
    ProjectName: string;
    ProjectDescription: string;
    ProjectContext: string;
    CommitInformation: string;
    website?: string;
  }

export const prompt = ({ProjectName, ProjectDescription, ProjectContext, CommitInformation,website}: IPrompt) => {
    return `
    Generate engaging "build in public" style tweets based on commit messages from GitHub for the provided project. 
    Each tweet should be informative, insightful, and up to 280 characters. Context about the app and commit messages will be provided. 
    The aim is to create 4 distinct variations for each set of input data, formatted as an array:
    ['result1', 'result2', 'result3', 'result4']
    Desired Output Format:

    Each tweet should be a small paragraph consisting of up to 280 characters.
    Maintain concise, informative, and engaging content.
    Avoid unnecessary emojis, hashtags, or other distractions.
    The tone should be informative and resemble a bot-generated tweet.
    Examples of the Desired Output:
    
    "Effortlessly manage subscriber tickets on http://breeew.com. Only 3 subs, yet just 1 ticket to handle. Fully automated for ultimate efficiency. #buildinpublic"
    
    "Iterated through 3 ideas before landing on the perfect fit: http://genphrase.com. Curious to hear your thoughts! Your feedback is invaluable. #buildinpublic"
    
    "Exciting launch of the toy version for my n&w s4 project! Dive into various frameworks to kick-start your ideas. Feel free to DM for the link. #buildinpublic"
    
    Topics to Focus On:
    
    Building in public
    Launching new features
    Product explanations
    Technology insights
    Additional Notes:
    
    Incorporate the "build in public" concept when relevant.
    Each tweet should ideally be up to 280 characters.
    The generated content should be engaging and compelling, even with limited context.
    Project Details:
    
    Project Name: ${ProjectName}
    Description: ${ProjectDescription}
    Context: ${ProjectContext}
    Website: ${website ? website : "No website provided"}
    Commit Messages or Pull Requests Information: ${CommitInformation}
    Generate four variations of tweets based on the provided project details and commit messages.
    `
}