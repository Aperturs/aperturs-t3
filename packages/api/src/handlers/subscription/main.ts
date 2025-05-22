import type { Variant } from "@api/index";
import {
  configureLemonSqueezy,
  getProduct,
  listPrices,
  listProducts,
} from "@api/index";

import type { user } from "@aperturs/db";
import type { CurrentPlan } from "@aperturs/validators/private_metadata";
import type { PlansType } from "@aperturs/validators/subscription";
import { db, eq, schema } from "@aperturs/db";

/**
 * This action will sync the product variants from Lemon Squeezy with the
 * Plans database model. It will only sync the 'subscription' variants.
 */
export async function FetchPlans() {
  configureLemonSqueezy();

  const allPlans: PlansType[] = [];

  // Fetch products from the Lemon Squeezy store.
  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });

  // Loop through all the variants.
  const allVariants = products.data?.included as Variant["data"][] | undefined;

  // for...of supports asynchronous operations, unlike forEach.
  if (allVariants) {
    for (const v of allVariants) {
      const variant = v.attributes;

      // Skip draft variants or if there's more than one variant, skip the default
      // variant. See https://docs.lemonsqueezy.com/api/variants
      if (
        variant.status === "draft" ||
        (allVariants.length !== 1 && variant.status === "pending")
      ) {
        // `return` exits the function entirely, not just the current iteration.
        continue;
      }

      // Fetch the Product name.
      const productName =
        (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

      // Fetch the Price object.
      const variantPriceObject = await listPrices({
        filter: {
          variantId: v.id,
        },
      });

      const currentPriceObj = variantPriceObject.data?.data.at(0);
      const isUsageBased =
        currentPriceObj?.attributes.usage_aggregation !== null;
      const interval = currentPriceObj?.attributes.renewal_interval_unit;
      const intervalCount =
        currentPriceObj?.attributes.renewal_interval_quantity;
      const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
      const trialIntervalCount =
        currentPriceObj?.attributes.trial_interval_quantity;

      const price = isUsageBased
        ? currentPriceObj?.attributes.unit_price_decimal
        : currentPriceObj.attributes.unit_price;

      const priceString = price !== null ? (price?.toString() ?? "") : "";

      const isSubscription =
        currentPriceObj?.attributes.category === "subscription";

      // If not a subscription, skip it.
      if (!isSubscription) {
        continue;
      }

      allPlans.push({
        variantName: variant.name,
        description: variant.description,
        price: priceString,
        interval: interval?.toString(),
        intervalCount: intervalCount ?? 0,
        isUsageBased,
        productId: variant.product_id,
        productName,
        variantId: parseInt(v.id) as unknown as number,
        trialInterval: trialInterval?.toString(),
        trialIntervalCount: trialIntervalCount ?? 0,
        sort: variant.sort,
        power: variant.sort,
        features: [],
      });
    }
  }
  console.log(allPlans, "plans");
  return allPlans;
}

export async function UpgradeLimits({
  currentPlan,
  userId,
}: {
  currentPlan: CurrentPlan;
  userId: string;
}) {
  let data = {
    clerkUserId: userId,
    updatedAt: new Date(),
  } as user.UserUsageInsert;
  if (currentPlan === "PRO") {
    data = {
      updatedAt: new Date(),
      clerkUserId: userId,
      organisation: 5,
      drafts: 30,
      generatedposts: 30,
      scheduledposts: 10,
      ideas: 20,
      projects: 5,
      scheduledtime: 30,
      socialaccounts: 10,
    };
  }
  if (currentPlan === "PRO2") {
    data = {
      updatedAt: new Date(),
      clerkUserId: userId,
      organisation: 10,
      drafts: 50,
      generatedposts: 50,
      scheduledposts: 20,
      ideas: 50,
      projects: 10,
      scheduledtime: 50,
      socialaccounts: 20,
    };
  }
  if (currentPlan === "PRO3") {
    data = {
      updatedAt: new Date(),
      clerkUserId: userId,
      organisation: 40,
      drafts: 1000,
      generatedposts: 200,
      scheduledposts: 1000,
      ideas: 1000,
      projects: 100,
      scheduledtime: 200,
      socialaccounts: 50,
    };
  }

  if (currentPlan === "FREE") {
    data = {
      updatedAt: new Date(),
      clerkUserId: userId,
      organisation: 0,
      drafts: 15,
      generatedposts: 20,
      scheduledposts: 15,
      ideas: 15,
      projects: 2,
      scheduledtime: 7,
      socialaccounts: 5,
    };
  }
  const usage = await db.query.userUsage.findFirst({
    where: eq(schema.userUsage.clerkUserId, userId),
  });

  if (usage) {
    await db
      .update(schema.userUsage)
      .set(data)
      .where(eq(schema.userUsage.clerkUserId, userId));
  } else {
    await db.insert(schema.userUsage).values(data);
  }
}
