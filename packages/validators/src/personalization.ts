import { z } from "zod";

// Define the Subtopic schema
export const SubtopicSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string().optional(),
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
  linkedinContentOptions: z.array(
    z.record(z.string(), z.array(SubtopicSchema)),
  ), // Record of string array
  preferences: z.record(z.string(), PreferenceSchema), // Record of Preference schema
});
export type PersonalPreferenceType = z.infer<typeof personalPreferenceSchema>;

export const topicsList: TopicType[] = [
  {
    label: "Coaching",
    value: "coaching",
    icon: "🎓",
    subtopics: [
      { value: "career_coaching", label: "Career Coaching", icon: "👔" },
      {
        value: "leadership_coaching",
        label: "Leadership Coaching",
        icon: "🏅",
      },
      { value: "life_coaching", label: "Life Coaching", icon: "🌱" },
      { value: "executive_coaching", label: "Executive Coaching", icon: "📊" },
      {
        value: "health_wellness_coaching",
        label: "Health & Wellness Coaching",
        icon: "🧘‍♂️",
      },
      {
        value: "relationship_coaching",
        label: "Relationship Coaching",
        icon: "❤️",
      },
      { value: "financial_coaching", label: "Financial Coaching", icon: "💵" },
      {
        value: "entrepreneurship_coaching",
        label: "Entrepreneurship Coaching",
        icon: "🚀",
      },
      { value: "academic_coaching", label: "Academic Coaching", icon: "📚" },
      {
        value: "communication_coaching",
        label: "Communication Coaching",
        icon: "🗣️",
      },
    ],
  },
  {
    label: "Design",
    value: "design",
    icon: "🎨",
    subtopics: [
      { value: "graphic_design", label: "Graphic Design", icon: "🖼️" },
      { value: "web_design", label: "Web Design", icon: "💻" },
      { value: "ux_ui_design", label: "UX/UI Design", icon: "📱" },
      { value: "motion_graphics", label: "Motion Graphics", icon: "🎥" },
      { value: "branding_design", label: "Branding Design", icon: "🏷️" },
      { value: "product_design", label: "Product Design", icon: "📦" },
      { value: "interior_design", label: "Interior Design", icon: "🏠" },
      { value: "illustration", label: "Illustration", icon: "✏️" },
      { value: "design_thinking", label: "Design Thinking", icon: "💡" },
      { value: "typography", label: "Typography", icon: "🔤" },
    ],
  },
  {
    label: "Finance",
    value: "finance",
    icon: "💰",
    subtopics: [
      { value: "personal_finance", label: "Personal Finance", icon: "👛" },
      {
        value: "investment_strategy",
        label: "Investment Strategy",
        icon: "📈",
      },
      { value: "financial_planning", label: "Financial Planning", icon: "🗂️" },
      { value: "cryptocurrency", label: "Cryptocurrency", icon: "₿" },
      { value: "stock_market", label: "Stock Market", icon: "📊" },
      {
        value: "real_estate_investing",
        label: "Real Estate Investing",
        icon: "🏘️",
      },
      {
        value: "retirement_planning",
        label: "Retirement Planning",
        icon: "🏦",
      },
      { value: "taxation", label: "Taxation", icon: "🧾" },
      { value: "insurance", label: "Insurance", icon: "🛡️" },
      {
        value: "financial_technology",
        label: "Financial Technology (FinTech)",
        icon: "💳",
      },
    ],
  },
  {
    label: "IT",
    value: "it",
    icon: "💻",
    subtopics: [
      {
        value: "software_development",
        label: "Software Development",
        icon: "💾",
      },
      { value: "cybersecurity", label: "Cybersecurity", icon: "🛡️" },
      { value: "cloud_computing", label: "Cloud Computing", icon: "☁️" },
      { value: "data_science", label: "Data Science", icon: "📊" },
      { value: "devops", label: "DevOps", icon: "🔧" },
      {
        value: "artificial_intelligence",
        label: "Artificial Intelligence",
        icon: "🤖",
      },
      {
        value: "blockchain_technology",
        label: "Blockchain Technology",
        icon: "🔗",
      },
      { value: "networking", label: "Networking", icon: "🌐" },
      {
        value: "internet_of_things",
        label: "Internet of Things (IoT)",
        icon: "📡",
      },
      { value: "it_management", label: "IT Management", icon: "📋" },
    ],
  },
  {
    label: "Marketing",
    value: "marketing",
    icon: "📢",
    subtopics: [
      { value: "digital_marketing", label: "Digital Marketing", icon: "🌐" },
      { value: "content_marketing", label: "Content Marketing", icon: "📝" },
      {
        value: "social_media_marketing",
        label: "Social Media Marketing",
        icon: "📱",
      },
      { value: "email_marketing", label: "Email Marketing", icon: "📧" },
      { value: "seo", label: "Search Engine Optimization (SEO)", icon: "🔍" },
      {
        value: "ppc_advertising",
        label: "Pay-Per-Click Advertising (PPC)",
        icon: "💸",
      },
      {
        value: "influencer_marketing",
        label: "Influencer Marketing",
        icon: "⭐",
      },
      { value: "branding_strategy", label: "Branding Strategy", icon: "🏷️" },
      { value: "market_research", label: "Market Research", icon: "🔬" },
      { value: "public_relations", label: "Public Relations", icon: "📞" },
    ],
  },
  {
    label: "Real Estate",
    value: "real_estate",
    icon: "🏠",
    subtopics: [
      {
        value: "property_management",
        label: "Property Management",
        icon: "🏢",
      },
      {
        value: "real_estate_investing",
        label: "Real Estate Investing",
        icon: "🏘️",
      },
      {
        value: "commercial_real_estate",
        label: "Commercial Real Estate",
        icon: "🏬",
      },
      {
        value: "residential_real_estate",
        label: "Residential Real Estate",
        icon: "🏡",
      },
      {
        value: "real_estate_marketing",
        label: "Real Estate Marketing",
        icon: "📈",
      },
      { value: "mortgages_loans", label: "Mortgages & Loans", icon: "🏦" },
      { value: "real_estate_law", label: "Real Estate Law", icon: "⚖️" },
      {
        value: "property_development",
        label: "Property Development",
        icon: "🚧",
      },
      { value: "home_staging", label: "Home Staging", icon: "🛋️" },
      { value: "luxury_real_estate", label: "Luxury Real Estate", icon: "🏰" },
    ],
  },
  {
    label: "Sales",
    value: "sales",
    icon: "📈",
    subtopics: [
      { value: "b2b_sales", label: "B2B Sales", icon: "🏢" },
      { value: "b2c_sales", label: "B2C Sales", icon: "🏠" },
      { value: "sales_strategy", label: "Sales Strategy", icon: "📋" },
      { value: "sales_training", label: "Sales Training", icon: "🎓" },
      { value: "lead_generation", label: "Lead Generation", icon: "🌱" },
      {
        value: "customer_relationship_management",
        label: "Customer Relationship Management (CRM)",
        icon: "🤝",
      },
      { value: "account_management", label: "Account Management", icon: "📂" },
      { value: "retail_sales", label: "Retail Sales", icon: "🛍️" },
      { value: "direct_sales", label: "Direct Sales", icon: "📞" },
      { value: "negotiation_skills", label: "Negotiation Skills", icon: "🤝" },
    ],
  },
  {
    label: "Web3",
    value: "web3",
    icon: "🔗",
    subtopics: [
      {
        value: "blockchain_development",
        label: "Blockchain Development",
        icon: "🔗",
      },
      {
        value: "decentralized_finance",
        label: "Decentralized Finance (DeFi)",
        icon: "🏦",
      },
      { value: "nfts", label: "Non-Fungible Tokens (NFTs)", icon: "🖼️" },
      { value: "smart_contracts", label: "Smart Contracts", icon: "📜" },
      {
        value: "dapp_development",
        label: "Decentralized Application (DApp) Development",
        icon: "📱",
      },
      { value: "web3_gaming", label: "Web3 Gaming", icon: "🎮" },
      {
        value: "dao_governance",
        label: "Decentralized Autonomous Organization (DAO) Governance",
        icon: "🏛️",
      },
      {
        value: "cryptographic_security",
        label: "Cryptographic Security",
        icon: "🔒",
      },
      { value: "privacy_protocols", label: "Privacy Protocols", icon: "🛡️" },
      {
        value: "web3_infrastructure",
        label: "Web3 Infrastructure",
        icon: "🛠️",
      },
    ],
  },
];

export const linkedinContentOptions = {
  whatYouPost: [
    {
      label: "Thought Leadership Strategies",
      value: "thought_leadership",
      icon: "🧠",
      description:
        "Share insights and strategies to position yourself as a thought leader.",
    },
    {
      label: "Company Updates",
      value: "company_updates",
      icon: "🏢",
      description:
        "Inform your network about the latest news and updates from your company.",
    },
    {
      label: "Industry News",
      value: "industry_news",
      icon: "📰",
      description: "Share important news and trends from your industry.",
    },
    {
      label: "Personal Achievements",
      value: "personal_achievements",
      icon: "🏆",
      description:
        "Highlight your personal milestones and professional achievements.",
    },
    {
      label: "Career Tips",
      value: "career_tips",
      icon: "💼",
      description: "Provide valuable advice and tips for career growth.",
    },
    {
      label: "Case Studies",
      value: "case_studies",
      icon: "📊",
      description:
        "Share detailed case studies to demonstrate expertise and insights.",
    },
    {
      label: "Event Announcements",
      value: "event_announcements",
      icon: "📅",
      description:
        "Promote upcoming events, webinars, or speaking engagements.",
    },
    {
      label: "Product Launches",
      value: "product_launches",
      icon: "🚀",
      description: "Announce new product launches or updates to your network.",
    },
    {
      label: "Educational Content",
      value: "educational_content",
      icon: "📚",
      description:
        "Share educational content that provides value to your audience.",
    },
  ],
  reasonsForPosting: [
    {
      label: "Networking",
      value: "networking",
      icon: "🤝",
      description: "Connect with other professionals to expand your network.",
    },
    {
      label: "Building a Personal Brand",
      value: "building_personal_brand",
      icon: "🌟",
      description:
        "Strengthen your personal brand by sharing relevant content.",
    },
    {
      label: "Seeking New Job Opportunities",
      value: "seeking_job_opportunities",
      icon: "🔍",
      description:
        "Leverage LinkedIn to explore and find new job opportunities.",
    },
    {
      label: "Generating Leads",
      value: "generating_leads",
      icon: "📈",
      description: "Use content to attract potential clients or customers.",
    },
    {
      label: "Recruiting Talent",
      value: "recruiting_talent",
      icon: "🎯",
      description: "Find and attract new talent to your team or company.",
    },
    {
      label: "Learning New Skills",
      value: "learning_new_skills",
      icon: "📖",
      description: "Stay updated on new skills and trends in your industry.",
    },
    {
      label: "Sharing Professional Expertise",
      value: "sharing_expertise",
      icon: "💡",
      description:
        "Share your knowledge and experience to establish authority.",
    },
    {
      label: "Promoting Events or Webinars",
      value: "promoting_events",
      icon: "📆",
      description:
        "Promote upcoming events or webinars to increase attendance.",
    },
    {
      label: "Researching Competitors",
      value: "researching_competitors",
      icon: "🔍",
      description: "Stay informed about what your competitors are doing.",
    },
  ],
  toneOfVoice: [
    {
      label: "Formal",
      value: "formal",
      icon: "📝",
      description: "Traditional and corporate-friendly tone of voice.",
    },
    {
      label: "Casual",
      value: "casual",
      icon: "😊",
      description: "Relaxed and approachable tone of voice.",
    },
    {
      label: "Inspirational",
      value: "inspirational",
      icon: "✨",
      description: "Uplifting and motivating tone of voice.",
    },
    {
      label: "Analytical",
      value: "analytical",
      icon: "📊",
      description: "Data-focused and detailed tone of voice.",
    },
    {
      label: "Conversational",
      value: "conversational",
      icon: "💬",
      description: "Interactive and friendly tone of voice.",
    },
    {
      label: "Authoritative",
      value: "authoritative",
      icon: "🔊",
      description: "Expert and commanding tone of voice.",
    },
    {
      label: "Witty",
      value: "witty",
      icon: "😄",
      description: "Humorous and clever tone of voice.",
    },
    {
      label: "Persuasive",
      value: "persuasive",
      icon: "🗣️",
      description: "Convincing and compelling tone of voice.",
    },
    {
      label: "Educational",
      value: "educational",
      icon: "📘",
      description: "Informative and instructive tone of voice.",
    },
  ],
  industries: [
    {
      label: "Coaching",
      value: "coaching",
      icon: "🎓",
      description: "Industry focused on mentoring and guiding individuals.",
    },
    {
      label: "Design",
      value: "design",
      icon: "🎨",
      description: "Industry focused on creative and visual communications.",
    },
    {
      label: "Finance",
      value: "finance",
      icon: "💰",
      description: "Industry focused on financial services and management.",
    },
    {
      label: "IT",
      value: "it",
      icon: "💻",
      description:
        "Industry focused on information technology and software development.",
    },
    {
      label: "Marketing",
      value: "marketing",
      icon: "📢",
      description:
        "Industry focused on promoting and selling products or services.",
    },
    {
      label: "Real Estate",
      value: "real_estate",
      icon: "🏠",
      description:
        "Industry focused on property buying, selling, and management.",
    },
    {
      label: "Sales",
      value: "sales",
      icon: "📈",
      description: "Industry focused on selling products or services.",
    },
    {
      label: "Web3",
      value: "web3",
      icon: "🔗",
      description: "Industry focused on decentralized internet technologies.",
    },
  ],
  positions: [
    {
      label: "Executive (CEO, CFO, CTO, etc.)",
      value: "executive",
      icon: "👔",
      description:
        "Top-level executives responsible for strategic decision-making.",
    },
    {
      label: "Designer (Graphic, UI/UX, Product)",
      value: "designer",
      icon: "🎨",
      description:
        "Creative professionals specializing in various types of design.",
    },
    {
      label: "Analyst (Business, Data, etc.)",
      value: "analyst",
      icon: "📊",
      description:
        "Professionals focused on analyzing data and business operations.",
    },
    {
      label: "Developer (Web, Software, Mobile)",
      value: "developer",
      icon: "💻",
      description:
        "Specialists in coding and developing software applications.",
    },
    {
      label: "Manager (Project, Sales, Marketing, etc.)",
      value: "manager",
      icon: "📋",
      description: "Professionals responsible for managing teams and projects.",
    },
    {
      label: "Marketing Professional",
      value: "marketing_professional",
      icon: "📢",
      description: "Experts in creating and executing marketing strategies.",
    },
    {
      label: "Consultant",
      value: "consultant",
      icon: "🕵️‍♂️",
      description:
        "Advisors providing expert guidance in their field of expertise.",
    },
    {
      label: "Writer/Editor",
      value: "writer_editor",
      icon: "✍️",
      description:
        "Professionals specializing in content creation and editing.",
    },
    {
      label: "Customer Service",
      value: "customer_service",
      icon: "🛎️",
      description:
        "Professionals dedicated to assisting and supporting customers.",
    },
  ],
};

// export const topicsList: TopicType[] = [
//   {
//     value: "personalDevelopment",
//     label: "Personal Development",
//     icon: "🧠",
//     subtopics: [
//       { value: "adaptability", label: "Adaptability", icon: "🔄" },
//       { value: "communication", label: "Communication", icon: "🗣️" },
//       { value: "creativity", label: "Creativity", icon: "🎨" },
//       { value: "goalSetting", label: "Goal Setting", icon: "🎯" },
//       { value: "growthMindset", label: "Growth Mindset", icon: "🌱" },
//       { value: "habits", label: "Habits", icon: "🔁" },
//       { value: "innovation", label: "Innovation", icon: "💡" },
//       { value: "inspiration", label: "Inspiration", icon: "✨" },
//       { value: "learning", label: "Learning", icon: "📚" },
//       { value: "mindfulness", label: "Mindfulness", icon: "🧘‍♂️" },
//       { value: "mindset", label: "Mindset", icon: "🧩" },
//       { value: "motivation", label: "Motivation", icon: "🔥" },
//       { value: "personalGrowth", label: "Personal Growth", icon: "📈" },
//       { value: "problemSolving", label: "Problem-Solving", icon: "🧩" },
//       { value: "psychology", label: "Psychology", icon: "🧠" },
//       { value: "relationships", label: "Relationships", icon: "❤️" },
//       { value: "saving", label: "Saving", icon: "💰" },
//       { value: "selfHelp", label: "Self-Help", icon: "🙌" },
//       { value: "selfImprovement", label: "Self-Improvement", icon: "🔝" },
//       { value: "spirituality", label: "Spirituality", icon: "🕊️" },
//       { value: "success", label: "Success", icon: "🏆" },
//       { value: "thinking", label: "Thinking", icon: "🤔" },
//       { value: "wellbeing", label: "Wellbeing", icon: "🌿" },
//     ],
//   },

//   {
//     value: "careerBusinessMoney",
//     label: "Career, Business & Money",
//     icon: "💼",
//     subtopics: [
//       { value: "analytics", label: "Analytics", icon: "📊" },
//       { value: "businessPlanning", label: "Business Planning", icon: "📝" },
//       { value: "businessStrategy", label: "Business Strategy", icon: "📈" },
//       { value: "capitalism", label: "Capitalism", icon: "🏦" },
//       { value: "careerDevelopment", label: "Career Development", icon: "🚀" },
//       { value: "corporateCulture", label: "Corporate Culture", icon: "🏢" },
//       {
//         value: "corporateSocialResponsibility",
//         label: "Corporate Social Responsibility",
//         icon: "🌍",
//       },
//       { value: "cryptocurrency", label: "Cryptocurrency", icon: "🪙" },
//       {
//         value: "digitalTransformation",
//         label: "Digital Transformation",
//         icon: "🌐",
//       },
//       { value: "economics", label: "Economics", icon: "📉" },
//       { value: "economy", label: "Economy", icon: "💹" },
//       { value: "entrepreneurship", label: "Entrepreneurship", icon: "🚀" },
//       { value: "finance", label: "Finance", icon: "💵" },
//       { value: "globalBusiness", label: "Global Business", icon: "🌍" },
//       { value: "growthHacking", label: "Growth Hacking", icon: "📈" },
//       { value: "investing", label: "Investing", icon: "📈" },
//       { value: "jobSearch", label: "Job Search", icon: "🔍" },
//       { value: "leadership", label: "Leadership", icon: "👑" },
//       { value: "management", label: "Management", icon: "📋" },
//       { value: "marketResearch", label: "Market Research", icon: "🔬" },
//       { value: "marketing", label: "Marketing", icon: "📣" },
//       { value: "networking", label: "Networking", icon: "🤝" },
//       { value: "personalFinance", label: "Personal Finance", icon: "💸" },
//       { value: "productivity", label: "Productivity", icon: "⏱️" },
//       {
//         value: "professionalDevelopment",
//         label: "Professional Development",
//         icon: "📚",
//       },
//       { value: "projectManagement", label: "Project Management", icon: "🗂️" },
//       { value: "resilience", label: "Resilience", icon: "💪" },
//       { value: "sales", label: "Sales", icon: "💼" },
//       { value: "startups", label: "Startups", icon: "🚀" },
//       { value: "teamBuilding", label: "Team Building", icon: "👥" },
//       { value: "technology", label: "Technology", icon: "💻" },
//       { value: "toolsResources", label: "Tools & Resources", icon: "🛠️" },
//     ],
//   },

//   {
//     value: "civilizationSociety",
//     label: "Civilization & Society",
//     icon: "🏛️",
//     subtopics: [
//       { value: "art", label: "Art", icon: "🎨" },
//       { value: "biography", label: "Biography", icon: "📖" },
//       { value: "celebrity", label: "Celebrity", icon: "🌟" },
//       { value: "culturalStudies", label: "Cultural Studies", icon: "📚" },
//       { value: "cultureArts", label: "Culture & Arts", icon: "🎭" },
//       { value: "design", label: "Design", icon: "✏️" },
//       { value: "geography", label: "Geography", icon: "🌍" },
//       { value: "globalIssues", label: "Global Issues", icon: "🌏" },
//       { value: "history", label: "History", icon: "📜" },
//       { value: "internet", label: "Internet", icon: "🌐" },
//       { value: "morality", label: "Morality", icon: "⚖️" },
//       {
//         value: "newsCurrentEvents",
//         label: "News & Current Events",
//         icon: "📰",
//       },
//       { value: "performingArts", label: "Performing Arts", icon: "🎭" },
//       { value: "philosophy", label: "Philosophy", icon: "📚" },
//       { value: "photography", label: "Photography", icon: "📷" },
//       { value: "politics", label: "Politics", icon: "🏛️" },
//       { value: "religion", label: "Religion", icon: "✝️" },
//       { value: "science", label: "Science", icon: "🔬" },
//       { value: "socialIssues", label: "Social Issues", icon: "👥" },
//       { value: "society", label: "Society", icon: "🏙️" },
//       { value: "visualArts", label: "Visual Arts", icon: "🖼️" },
//     ],
//   },

//   {
//     value: "booksWriting",
//     label: "Books & Writing",
//     icon: "📚",
//     subtopics: [
//       { value: "academicWriting", label: "Academic Writing", icon: "📝" },
//       { value: "authorInterviews", label: "Author Interviews", icon: "🎙️" },
//       {
//         value: "bookRecommendations",
//         label: "Book Recommendations",
//         icon: "📚",
//       },
//       { value: "bookReviews", label: "Book Reviews", icon: "🔖" },
//       { value: "books", label: "Books", icon: "📚" },
//       { value: "creativeWriting", label: "Creative Writing", icon: "✍️" },
//       { value: "education", label: "Education", icon: "🎓" },
//       { value: "fiction", label: "Fiction", icon: "📖" },
//       {
//         value: "historicalLiterature",
//         label: "Historical Literature",
//         icon: "📜",
//       },
//       { value: "journalism", label: "Journalism", icon: "📰" },
//       { value: "literature", label: "Literature", icon: "📚" },
//       { value: "nonFiction", label: "Non-fiction", icon: "📖" },
//       { value: "publishing", label: "Publishing", icon: "📚" },
//       { value: "reading", label: "Reading", icon: "📖" },
//       { value: "storytelling", label: "Storytelling", icon: "📖" },
//       { value: "writing", label: "Writing", icon: "✍️" },
//     ],
//   },

//   {
//     value: "healthWellness",
//     label: "Health & Wellness",
//     icon: "🏋️",
//     subtopics: [
//       { value: "aquaticActivities", label: "Aquatic Activities", icon: "🏊‍♂️" },
//       { value: "bodybuilding", label: "Bodybuilding", icon: "🏋️‍♂️" },
//       { value: "brainHealth", label: "Brain Health", icon: "🧠" },
//       { value: "dietLifestyle", label: "Diet & Lifestyle", icon: "🍎" },
//       { value: "enduranceTraining", label: "Endurance Training", icon: "🏃‍♂️" },
//       { value: "exercise", label: "Exercise", icon: "🤸‍♂️" },
//       { value: "fitness", label: "Fitness", icon: "💪" },
//       { value: "food", label: "Food", icon: "🍽️" },
//       { value: "health", label: "Health", icon: "❤️" },
//       { value: "healthyEating", label: "Healthy Eating", icon: "🥗" },
//       { value: "healthyLiving", label: "Healthy Living", icon: "🌿" },
//       { value: "holisticHealth", label: "Holistic Health", icon: "🧘‍♂️" },
//       { value: "hydration", label: "Hydration", icon: "💧" },
//       { value: "medicalAdvances", label: "Medical Advances", icon: "🩺" },
//       { value: "meditation", label: "Meditation", icon: "🧘‍♂️" },
//       { value: "mentalClarity", label: "Mental Clarity", icon: "🧠" },
//       { value: "mentalHealth", label: "Mental Health", icon: "🧠" },
//       { value: "nutrition", label: "Nutrition", icon: "🍏" },
//       { value: "outdoorActivities", label: "Outdoor Activities", icon: "🏕️" },
//       { value: "physicalActivity", label: "Physical Activity", icon: "🏃‍♀️" },
//       { value: "selfCare", label: "Self-Care", icon: "🛀" },
//       { value: "skinCare", label: "Skin Care", icon: "💆‍♀️" },
//       { value: "sleep", label: "Sleep", icon: "🛌" },
//       { value: "strengthTraining", label: "Strength Training", icon: "🏋️‍♂️" },
//       { value: "stressManagement", label: "Stress Management", icon: "🧘‍♀️" },
//       { value: "travel", label: "Travel", icon: "✈️" },
//       { value: "yoga", label: "Yoga", icon: "🧘‍♀️" },
//     ],
//   },

//   {
//     value: "technologyInnovation",
//     label: "Technology & Innovation",
//     icon: "💻",
//     subtopics: [
//       { value: "3dPrinting", label: "3D Printing", icon: "🖨️" },
//       {
//         value: "artificialIntelligence",
//         label: "Artificial Intelligence",
//         icon: "🤖",
//       },
//       { value: "bigData", label: "Big Data", icon: "📊" },
//       { value: "biotechnology", label: "Biotechnology", icon: "🧬" },
//       { value: "branding", label: "Branding", icon: "🏷️" },
//       { value: "communityBuilding", label: "Community Building", icon: "🏘️" },
//       { value: "computerScience", label: "Computer Science", icon: "💻" },
//       { value: "cybersecurity", label: "Cybersecurity", icon: "🛡️" },
//       { value: "dataScience", label: "Data Science", icon: "📈" },
//       { value: "digitalMarketing", label: "Digital Marketing", icon: "📱" },
//       { value: "engineering", label: "Engineering", icon: "🛠️" },
//       { value: "gamingTechnology", label: "Gaming Technology", icon: "🎮" },
//       { value: "hardware", label: "Hardware", icon: "🖥️" },
//       {
//         value: "informationTechnology",
//         label: "Information Technology",
//         icon: "💾",
//       },
//       { value: "innovations", label: "Innovations", icon: "💡" },
//       {
//         value: "internetOfThings",
//         label: "Internet of Things (IoT)",
//         icon: "🌐",
//       },
//       { value: "mobileTechnology", label: "Mobile Technology", icon: "📱" },
//       { value: "neuralNetworks", label: "Neural Networks", icon: "🧠" },
//       { value: "productManagement", label: "Product Management", icon: "📦" },
//       { value: "quantumComputing", label: "Quantum Computing", icon: "🖥️" },
//       { value: "robotics", label: "Robotics", icon: "🤖" },
//       { value: "scientificResearch", label: "Scientific Research", icon: "🔬" },
//       {
//         value: "softwareDevelopment",
//         label: "Software Development",
//         icon: "💻",
//       },
//       { value: "spaceExploration", label: "Space Exploration", icon: "🚀" },
//       { value: "techTools", label: "Tech Tools", icon: "🛠️" },
//       { value: "techTrends", label: "Tech Trends", icon: "📈" },
//       { value: "telecommunications", label: "Telecommunications", icon: "📞" },
//       { value: "userExperience", label: "User Experience (UX)", icon: "🖥️" },
//     ],
//   },
// ];
