import { z } from "zod";

// Define the Subtopic schema
export const SubtopicSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string(),
});

export type SubTopicType = z.infer<typeof SubtopicSchema>;

// Define the Topic schema that includes the Subtopic schema
export const TopicSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string(),
  subtopics: z.array(SubtopicSchema),
});

export type TopicType = z.infer<typeof TopicSchema>;

// Define the Preference enum
export const PreferenceSchema = z.enum([
  "No",
  "Sometimes",
  "Remove",
  "Auto",
  "Avoid",
]);

export type PreferenceType = z.infer<typeof PreferenceSchema>;

// Define the PreferenceOption schema
export const PreferenceOptionSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string(),
  options: z.array(PreferenceSchema),
});

export type PreferenceOptionType = z.infer<typeof PreferenceOptionSchema>;

export const preferenceOptions: PreferenceOptionType[] = [
  {
    key: "emoji",
    title: "Remove emoji",
    description: "Choose how to handle emojis in the text",
    options: ["No", "Sometimes", "Remove"],
  },
  {
    key: "hashtags",
    title: "Remove hashtags",
    description: "Choose how to handle hashtags in the text",
    options: ["No", "Sometimes", "Remove"],
  },
  {
    key: "firstLetterCapital",
    title: "Avoid first letter capital",
    description: "Choose how to handle capitalization of the first letter",
    options: ["Auto", "Sometimes", "Avoid"],
  },
  {
    key: "punctuation",
    title: "Avoid punctuation",
    description: "Choose how to handle punctuation in the text",
    options: ["Auto", "Sometimes", "Avoid"],
  },
  // {
  //   key: "authorName",
  //   title: "Avoid using author name in replies",
  //   description: "Choose how to handle author names in replies",
  //   options: ["Auto", "Sometimes", "Avoid"],
  // },
];

export const personalPreferenceSchema = z.object({
  subTopics: z.array(SubtopicSchema), // Array of Subtopic schema
  preferences: z.record(z.string(), PreferenceSchema), // Record of Preference schema
});
export type PersonalPreferenceType = z.infer<typeof personalPreferenceSchema>;

export const topicsList: TopicType[] = [
  {
    value: "personalDevelopment",
    label: "Personal Development",
    icon: "🧠",
    subtopics: [
      { value: "adaptability", label: "Adaptability", icon: "🔄" },
      { value: "communication", label: "Communication", icon: "🗣️" },
      { value: "creativity", label: "Creativity", icon: "🎨" },
      { value: "goalSetting", label: "Goal Setting", icon: "🎯" },
      { value: "growthMindset", label: "Growth Mindset", icon: "🌱" },
      { value: "habits", label: "Habits", icon: "🔁" },
      { value: "innovation", label: "Innovation", icon: "💡" },
      { value: "inspiration", label: "Inspiration", icon: "✨" },
      { value: "learning", label: "Learning", icon: "📚" },
      { value: "mindfulness", label: "Mindfulness", icon: "🧘‍♂️" },
      { value: "mindset", label: "Mindset", icon: "🧩" },
      { value: "motivation", label: "Motivation", icon: "🔥" },
      { value: "personalGrowth", label: "Personal Growth", icon: "📈" },
      { value: "problemSolving", label: "Problem-Solving", icon: "🧩" },
      { value: "psychology", label: "Psychology", icon: "🧠" },
      { value: "relationships", label: "Relationships", icon: "❤️" },
      { value: "saving", label: "Saving", icon: "💰" },
      { value: "selfHelp", label: "Self-Help", icon: "🙌" },
      { value: "selfImprovement", label: "Self-Improvement", icon: "🔝" },
      { value: "spirituality", label: "Spirituality", icon: "🕊️" },
      { value: "success", label: "Success", icon: "🏆" },
      { value: "thinking", label: "Thinking", icon: "🤔" },
      { value: "wellbeing", label: "Wellbeing", icon: "🌿" },
    ],
  },

  {
    value: "careerBusinessMoney",
    label: "Career, Business & Money",
    icon: "💼",
    subtopics: [
      { value: "analytics", label: "Analytics", icon: "📊" },
      { value: "businessPlanning", label: "Business Planning", icon: "📝" },
      { value: "businessStrategy", label: "Business Strategy", icon: "📈" },
      { value: "capitalism", label: "Capitalism", icon: "🏦" },
      { value: "careerDevelopment", label: "Career Development", icon: "🚀" },
      { value: "corporateCulture", label: "Corporate Culture", icon: "🏢" },
      {
        value: "corporateSocialResponsibility",
        label: "Corporate Social Responsibility",
        icon: "🌍",
      },
      { value: "cryptocurrency", label: "Cryptocurrency", icon: "🪙" },
      {
        value: "digitalTransformation",
        label: "Digital Transformation",
        icon: "🌐",
      },
      { value: "economics", label: "Economics", icon: "📉" },
      { value: "economy", label: "Economy", icon: "💹" },
      { value: "entrepreneurship", label: "Entrepreneurship", icon: "🚀" },
      { value: "finance", label: "Finance", icon: "💵" },
      { value: "globalBusiness", label: "Global Business", icon: "🌍" },
      { value: "growthHacking", label: "Growth Hacking", icon: "📈" },
      { value: "investing", label: "Investing", icon: "📈" },
      { value: "jobSearch", label: "Job Search", icon: "🔍" },
      { value: "leadership", label: "Leadership", icon: "👑" },
      { value: "management", label: "Management", icon: "📋" },
      { value: "marketResearch", label: "Market Research", icon: "🔬" },
      { value: "marketing", label: "Marketing", icon: "📣" },
      { value: "networking", label: "Networking", icon: "🤝" },
      { value: "personalFinance", label: "Personal Finance", icon: "💸" },
      { value: "productivity", label: "Productivity", icon: "⏱️" },
      {
        value: "professionalDevelopment",
        label: "Professional Development",
        icon: "📚",
      },
      { value: "projectManagement", label: "Project Management", icon: "🗂️" },
      { value: "resilience", label: "Resilience", icon: "💪" },
      { value: "sales", label: "Sales", icon: "💼" },
      { value: "startups", label: "Startups", icon: "🚀" },
      { value: "teamBuilding", label: "Team Building", icon: "👥" },
      { value: "technology", label: "Technology", icon: "💻" },
      { value: "toolsResources", label: "Tools & Resources", icon: "🛠️" },
    ],
  },

  {
    value: "civilizationSociety",
    label: "Civilization & Society",
    icon: "🏛️",
    subtopics: [
      { value: "art", label: "Art", icon: "🎨" },
      { value: "biography", label: "Biography", icon: "📖" },
      { value: "celebrity", label: "Celebrity", icon: "🌟" },
      { value: "culturalStudies", label: "Cultural Studies", icon: "📚" },
      { value: "cultureArts", label: "Culture & Arts", icon: "🎭" },
      { value: "design", label: "Design", icon: "✏️" },
      { value: "geography", label: "Geography", icon: "🌍" },
      { value: "globalIssues", label: "Global Issues", icon: "🌏" },
      { value: "history", label: "History", icon: "📜" },
      { value: "internet", label: "Internet", icon: "🌐" },
      { value: "morality", label: "Morality", icon: "⚖️" },
      {
        value: "newsCurrentEvents",
        label: "News & Current Events",
        icon: "📰",
      },
      { value: "performingArts", label: "Performing Arts", icon: "🎭" },
      { value: "philosophy", label: "Philosophy", icon: "📚" },
      { value: "photography", label: "Photography", icon: "📷" },
      { value: "politics", label: "Politics", icon: "🏛️" },
      { value: "religion", label: "Religion", icon: "✝️" },
      { value: "science", label: "Science", icon: "🔬" },
      { value: "socialIssues", label: "Social Issues", icon: "👥" },
      { value: "society", label: "Society", icon: "🏙️" },
      { value: "visualArts", label: "Visual Arts", icon: "🖼️" },
    ],
  },

  {
    value: "booksWriting",
    label: "Books & Writing",
    icon: "📚",
    subtopics: [
      { value: "academicWriting", label: "Academic Writing", icon: "📝" },
      { value: "authorInterviews", label: "Author Interviews", icon: "🎙️" },
      {
        value: "bookRecommendations",
        label: "Book Recommendations",
        icon: "📚",
      },
      { value: "bookReviews", label: "Book Reviews", icon: "🔖" },
      { value: "books", label: "Books", icon: "📚" },
      { value: "creativeWriting", label: "Creative Writing", icon: "✍️" },
      { value: "education", label: "Education", icon: "🎓" },
      { value: "fiction", label: "Fiction", icon: "📖" },
      {
        value: "historicalLiterature",
        label: "Historical Literature",
        icon: "📜",
      },
      { value: "journalism", label: "Journalism", icon: "📰" },
      { value: "literature", label: "Literature", icon: "📚" },
      { value: "nonFiction", label: "Non-fiction", icon: "📖" },
      { value: "publishing", label: "Publishing", icon: "📚" },
      { value: "reading", label: "Reading", icon: "📖" },
      { value: "storytelling", label: "Storytelling", icon: "📖" },
      { value: "writing", label: "Writing", icon: "✍️" },
    ],
  },

  {
    value: "healthWellness",
    label: "Health & Wellness",
    icon: "🏋️",
    subtopics: [
      { value: "aquaticActivities", label: "Aquatic Activities", icon: "🏊‍♂️" },
      { value: "bodybuilding", label: "Bodybuilding", icon: "🏋️‍♂️" },
      { value: "brainHealth", label: "Brain Health", icon: "🧠" },
      { value: "dietLifestyle", label: "Diet & Lifestyle", icon: "🍎" },
      { value: "enduranceTraining", label: "Endurance Training", icon: "🏃‍♂️" },
      { value: "exercise", label: "Exercise", icon: "🤸‍♂️" },
      { value: "fitness", label: "Fitness", icon: "💪" },
      { value: "food", label: "Food", icon: "🍽️" },
      { value: "health", label: "Health", icon: "❤️" },
      { value: "healthyEating", label: "Healthy Eating", icon: "🥗" },
      { value: "healthyLiving", label: "Healthy Living", icon: "🌿" },
      { value: "holisticHealth", label: "Holistic Health", icon: "🧘‍♂️" },
      { value: "hydration", label: "Hydration", icon: "💧" },
      { value: "medicalAdvances", label: "Medical Advances", icon: "🩺" },
      { value: "meditation", label: "Meditation", icon: "🧘‍♂️" },
      { value: "mentalClarity", label: "Mental Clarity", icon: "🧠" },
      { value: "mentalHealth", label: "Mental Health", icon: "🧠" },
      { value: "nutrition", label: "Nutrition", icon: "🍏" },
      { value: "outdoorActivities", label: "Outdoor Activities", icon: "🏕️" },
      { value: "physicalActivity", label: "Physical Activity", icon: "🏃‍♀️" },
      { value: "selfCare", label: "Self-Care", icon: "🛀" },
      { value: "skinCare", label: "Skin Care", icon: "💆‍♀️" },
      { value: "sleep", label: "Sleep", icon: "🛌" },
      { value: "strengthTraining", label: "Strength Training", icon: "🏋️‍♂️" },
      { value: "stressManagement", label: "Stress Management", icon: "🧘‍♀️" },
      { value: "travel", label: "Travel", icon: "✈️" },
      { value: "yoga", label: "Yoga", icon: "🧘‍♀️" },
    ],
  },

  {
    value: "technologyInnovation",
    label: "Technology & Innovation",
    icon: "💻",
    subtopics: [
      { value: "3dPrinting", label: "3D Printing", icon: "🖨️" },
      {
        value: "artificialIntelligence",
        label: "Artificial Intelligence",
        icon: "🤖",
      },
      { value: "bigData", label: "Big Data", icon: "📊" },
      { value: "biotechnology", label: "Biotechnology", icon: "🧬" },
      { value: "branding", label: "Branding", icon: "🏷️" },
      { value: "communityBuilding", label: "Community Building", icon: "🏘️" },
      { value: "computerScience", label: "Computer Science", icon: "💻" },
      { value: "cybersecurity", label: "Cybersecurity", icon: "🛡️" },
      { value: "dataScience", label: "Data Science", icon: "📈" },
      { value: "digitalMarketing", label: "Digital Marketing", icon: "📱" },
      { value: "engineering", label: "Engineering", icon: "🛠️" },
      { value: "gamingTechnology", label: "Gaming Technology", icon: "🎮" },
      { value: "hardware", label: "Hardware", icon: "🖥️" },
      {
        value: "informationTechnology",
        label: "Information Technology",
        icon: "💾",
      },
      { value: "innovations", label: "Innovations", icon: "💡" },
      {
        value: "internetOfThings",
        label: "Internet of Things (IoT)",
        icon: "🌐",
      },
      { value: "mobileTechnology", label: "Mobile Technology", icon: "📱" },
      { value: "neuralNetworks", label: "Neural Networks", icon: "🧠" },
      { value: "productManagement", label: "Product Management", icon: "📦" },
      { value: "quantumComputing", label: "Quantum Computing", icon: "🖥️" },
      { value: "robotics", label: "Robotics", icon: "🤖" },
      { value: "scientificResearch", label: "Scientific Research", icon: "🔬" },
      {
        value: "softwareDevelopment",
        label: "Software Development",
        icon: "💻",
      },
      { value: "spaceExploration", label: "Space Exploration", icon: "🚀" },
      { value: "techTools", label: "Tech Tools", icon: "🛠️" },
      { value: "techTrends", label: "Tech Trends", icon: "📈" },
      { value: "telecommunications", label: "Telecommunications", icon: "📞" },
      { value: "userExperience", label: "User Experience (UX)", icon: "🖥️" },
    ],
  },
];
