import type { FeatureType, PlansType } from "@aperturs/validators/subscription";

export const BaseFeatures: FeatureType[] = [
  {
    name: "Social accounts",
    baseValue: "Varies",
    description:
      "The number of social media accounts you can connect and manage.",
  },
  {
    name: "Schedule into the future",
    baseValue: "Unlimited",
    description:
      "The maximum duration for which you can schedule posts in advance.",
  },
  {
    name: "Scheduled posts",
    baseValue: "Unlimited",
    description:
      "The total number of posts you can schedule at any given time.",
  },
  {
    name: "Save as drafts",
    baseValue: "Unlimited",
    description:
      "The number of posts you can save as drafts for later editing or posting.",
  },
  {
    name: "AI Tokens",
    baseValue: "Unlimited",
    description:
      "The number of AI-generated tokens you can use to create posts.",
  },
  {
    name: "History",
    baseValue: "Unlimited",
    description:
      "The length of time your post history will be retained and accessible.",
  },
];

type BaseFeatureNames = (typeof BaseFeatures)[number]["name"];

type PlanFeatureOverrides = Partial<
  Record<
    BaseFeatureNames,
    { value?: string | number | boolean; description?: string }
  >
>;

const mergeFeatures = (
  baseFeatures: FeatureType[],
  planName: string,
): FeatureType[] => {
  // Initialize the merged object with default values from baseFeatures
  const merged: Record<
    FeatureType["name"],
    { value: string | number | boolean; description: string }
  > = baseFeatures.reduce(
    (acc, feature) => {
      acc[feature.name] = {
        value: feature.baseValue,
        description: feature.description,
      };
      return acc;
    },
    {} as Record<
      FeatureType["name"],
      { value: string | number | boolean; description: string }
    >,
  );

  // Apply overrides from PlanFeatureOverrides
  const overrides = PlanFeatureOverrides[planName] ?? {};

  for (const [key, value] of Object.entries(overrides)) {
    if (key in merged) {
      if (value.value !== undefined) {
        merged[key as FeatureType["name"]].value = value.value;
      }
      if (value.description !== undefined) {
        merged[key as FeatureType["name"]].description = value.description;
      }
    }
  }

  // Convert merged object back to array format
  return baseFeatures.map((feature) => ({
    name: feature.name,
    baseValue: merged[feature.name]?.value || feature.baseValue,
    description: merged[feature.name]?.description || feature.description,
  }));
};

const PlanFeatureOverrides: Record<string, PlanFeatureOverrides> = {
  "Solo Creator": {
    "Social accounts": { value: 4 },
    "Schedule into the future": { value: "14 days" },
    History: { value: "30 days" },
    "Scheduled posts": { value: 30 },
    "Save as drafts": { value: 25 },
    "AI Tokens": { value: 1000, description: "Approximately 200 posts" },
  },
  "Small Business": {
    "Social accounts": { value: 15 },
    "Schedule into the future": { value: "60 days" },
    History: { value: "60 days" },
    "Scheduled posts": { value: 500 },
    "Save as drafts": { value: 500 },
    "AI Tokens": { value: 5000, description: "Approximately 1000 posts" },
  },
  Business: {
    "Social accounts": { value: 100 },
  },
};

const soloCreatorFeatures = mergeFeatures(BaseFeatures, "Solo Creator");
const smallBusinessFeatures = mergeFeatures(BaseFeatures, "Small Business");
const businessFeatures = mergeFeatures(BaseFeatures, "Business");

// export const Plans = [
//   {
//     variantName: "Montly",
//     description: "",
//     price: "9400",
//     interval: "month",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 327492,
//     productName: "business",
//     variantId: 478433,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 3,
//     power: 3,
//     features: businessFeatures,
//   },
//   {
//     variantName: "Yearly",
//     description: "",
//     price: "94000",
//     interval: "year",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 327492,
//     productName: "business",
//     variantId: 478434,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 3,
//     power: 6,
//     features: businessFeatures,
//   },
//   {
//     variantName: "Monthly",
//     description: "",
//     price: "2800",
//     interval: "month",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 327491,
//     productName: "Small Business",
//     variantId: 478430,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 2,
//     power: 2,
//     features: smallBusinessFeatures,
//   },
//   {
//     variantName: "Yearly",
//     description: "",
//     price: "28000",
//     interval: "year",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 327491,
//     productName: "Small Business",
//     variantId: 478431,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 2,
//     power: 2,
//     features: smallBusinessFeatures,
//   },
//   {
//     variantName: "Monthly",
//     description: "",
//     price: "1900",
//     interval: "month",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 162658,
//     productName: "Solo Creator",
//     variantId: 205659,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 1,
//     power: 1,
//     features: soloCreatorFeatures,
//   },
//   {
//     variantName: "Yearly",
//     description: "",
//     price: "19000",
//     interval: "year",
//     intervalCount: 1,
//     isUsageBased: false,
//     productId: 162658,
//     productName: "Solo Creator",
//     variantId: 205660,
//     trialInterval: "day",
//     trialIntervalCount: 7,
//     sort: 1,
//     power: 1,
//     features: soloCreatorFeatures,
//   },
// ] as PlansType[];

export const Plans = [
  {
    variantName: "montly",
    description: null,
    price: "6000.000000000000",
    interval: "month",
    intervalCount: 1,
    isUsageBased: false,
    productId: 174109,
    productName: "business",
    variantId: 224378,
    trialIntervalCount: 0,
    features: businessFeatures,
    sort: 3,
    power: 3,
  },
  {
    variantName: "Yearly",
    description: null,
    price: "60000.000000000000",
    interval: "year",
    intervalCount: 1,
    isUsageBased: false,
    productId: 174109,
    productName: "business",
    variantId: 224379,
    trialInterval: "day",
    trialIntervalCount: 14,
    sort: 3,
    power: 6,
    features: businessFeatures,
  },
  {
    variantName: "Monthly",
    description: null,
    price: "2500.000000000000",
    interval: "month",
    intervalCount: 1,
    isUsageBased: false,
    productId: 174106,
    productName: "small business",
    important: true,
    variantId: 224369,
    trialIntervalCount: 0,
    sort: 2,
    power: 2,
    features: smallBusinessFeatures,
  },
  {
    variantName: "Yearly",
    description: null,
    price: "25000.000000000000",
    interval: "year",
    intervalCount: 1,
    isUsageBased: false,
    productId: 174106,
    important: true,
    productName: "small business",
    variantId: 224373,
    trialInterval: "day",
    trialIntervalCount: 14,
    sort: 2,
    power: 5,
    features: smallBusinessFeatures,
  },
  {
    variantName: "Yearly pricing",
    description: "<p>yearly pricing</p>",
    price: "14000",
    interval: "year",
    intervalCount: 1,
    isUsageBased: false,
    productId: 113580,
    productName: "Solo Creator",
    variantId: 129346,
    trialInterval: "day",
    features: soloCreatorFeatures,
    trialIntervalCount: 14,
    sort: 1,
    power: 4,
  },
  {
    variantName: "monthly",
    description: null,
    price: "1400",
    interval: "month",
    intervalCount: 1,
    isUsageBased: false,
    productId: 113580,
    productName: "Solo Creator",
    variantId: 129349,
    trialInterval: "day",
    trialIntervalCount: 14,
    sort: 1,
    power: 1,
    features: soloCreatorFeatures,
  },
] as PlansType[];
