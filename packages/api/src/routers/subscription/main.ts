/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { updateUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";
import { FetchPlans, UpgradeLimits } from "@api/handlers/subscription/main";
import { Plans } from "@api/handlers/subscription/plans";
import {
  leamonWebhookHasData,
  leamonWebhookHasMeta,
} from "@api/helpers/type-guard";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@api/trpc";
import { configureLemonSqueezy } from "@api/utils/lemon-squeezy";
import {
  cancelSubscription,
  createCheckout,
  getPrice,
  getSubscription,
  listSubscriptionInvoices,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";
import { z } from "zod";

import type { subscriptions } from "@aperturs/db";
import type { UserDetails } from "@aperturs/validators/user";
import { and, db, eq, gte, logs, schema } from "@aperturs/db";

import { env } from "../../../env";

export const subscriptionRouter = createTRPCRouter({
  fetchPlans: protectedProcedure.query(async () => {
    return await FetchPlans();
  }),
  storeWebhookEvent: publicProcedure
    .input(logs.webhookEventInsert)
    .mutation(async ({ input }) => {
      const [returnedValue] = await db
        .insert(logs.webhookEvents)
        .values({
          eventName: input.eventName,
          processed: false,
          body: input.body,
        })
        .returning();

      if (!returnedValue) throw new Error("Failed to store webhook event.");
      return returnedValue as logs.WebhookEventSelect;
    }),

  processWebhookEvent: publicProcedure
    .input(logs.webhookEventSelect)
    .mutation(async ({ input }) => {
      configureLemonSqueezy();

      const dbwebhookEvent = await db
        .select()
        .from(schema.webhookEvents)
        .where(eq(schema.webhookEvents.id, input.id));

      if (dbwebhookEvent.length < 1) {
        throw new Error(
          `Webhook event #${input.id} not found in the database.`,
        );
      }

      let processingError = "";
      const eventBody = input.body;

      if (!leamonWebhookHasMeta(eventBody)) {
        processingError = "Event body is missing the 'meta' property.";
      } else if (leamonWebhookHasData(eventBody)) {
        if (input.eventName.startsWith("subscription_payment_")) {
          // Save subscription invoices; eventBody is a SubscriptionInvoice
          // Not implemented.
        } else if (input.eventName.startsWith("subscription_")) {
          // Save subscription events; obj is a Subscription
          const attributes = eventBody.data.attributes;
          const variantId = attributes.variant_id as string;

          // We assume that the Plan table is up to date.
          const plan = Plans.filter((p) => p.variantId === parseInt(variantId));

          if (plan.length < 1 || !plan[0]) {
            processingError = `Plan with variantId ${variantId} not found.`;
          } else {
            // Update the subscription in the database.

            const priceId = attributes.first_subscription_item.price_id;

            // Get the price data from Lemon Squeezy.
            const priceData = await getPrice(priceId);
            if (priceData.error) {
              processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.  Error: ${priceData.error.message}`;
            }

            const isUsageBased =
              attributes.first_subscription_item.is_usage_based;
            const price = isUsageBased
              ? priceData.data?.data.attributes.unit_price_decimal
              : priceData.data?.data.attributes.unit_price;

            const updateData: subscriptions.SubscriptionInsert = {
              lemonSqueezyId: eventBody.data.id,
              orderId: attributes.order_id as number,
              name: attributes.user_name as string,
              email: attributes.user_email as string,
              status: attributes.status as string,
              statusFormatted: attributes.status_formatted as string,
              renewsAt: attributes.renews_at as string,
              endsAt: attributes.ends_at as string,
              trialEndsAt: attributes.trial_ends_at as string,
              price: price?.toString() ?? "",
              isPaused: false,
              subscriptionItemId: attributes.first_subscription_item.id,
              isUsageBased: attributes.first_subscription_item.is_usage_based,
              userId: eventBody.meta.custom_data.user_id,
              planId: plan[0].variantId,
            };

            const currentPlan =
              plan[0].sort === 1
                ? "PRO"
                : plan[0].sort === 2
                  ? "PRO2"
                  : attributes.status === "expired"
                    ? "FREE"
                    : "PRO3";

            // Create/update subscription in the database.
            try {
              await db.transaction(async (tx) => {
                await tx
                  .insert(schema.subscriptions)
                  .values(updateData)
                  .onConflictDoUpdate({
                    target: schema.subscriptions.lemonSqueezyId,
                    set: updateData,
                  });
                await tx
                  .update(schema.user)
                  .set({
                    currentPlan: currentPlan,
                    lsCustomerId: attributes.customer_id as string,
                  })
                  .where(eq(schema.user.clerkUserId, updateData.userId));
                await UpgradeLimits({
                  currentPlan,
                  userId: updateData.userId,
                });
                await updateUserPrivateMetadata({
                  userId: updateData.userId,
                  currentPlan: currentPlan,
                  lsCustomerId: attributes.customer_id as string,
                  lsCurrentPeriodEnd:
                    (attributes.ends_at as string) ??
                    (attributes.trial_ends_at as string),
                });
              });
            } catch (error) {
              processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database. Error: ${error as string}`;
              console.error(error);
            }
          }
        } else if (input.eventName.startsWith("order_")) {
          // Save orders; eventBody is a "Order"
          /* Not implemented */
        } else if (input.eventName.startsWith("license_")) {
          // Save license keys; eventBody is a "License key"
          /* Not implemented */
        }

        // Update the webhook event in the database.
        await db
          .update(logs.webhookEvents)
          .set({
            processed: true,
            processingError,
          })
          .where(eq(logs.webhookEvents.id, input.id));
      }
    }),

  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await db.query.subscriptions.findMany({
      where: eq(schema.subscriptions.userId, ctx.currentUser),
    });

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      if (a.status === "active" && b.status !== "active") {
        return -1;
      }
      if (a.status !== "on_trail" && b.status !== "on_trail") {
        return -1;
      }
      if (a.status === "paused" && b.status === "cancelled") {
        return -1;
      }

      return 0;
    });
    return sortedSubscriptions;
  }),
  getSubscriptionURLs: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      configureLemonSqueezy();
      const subscription = await getSubscription(input.id);
      if (subscription.error) {
        throw new Error(subscription.error.message);
      }

      return subscription.data?.data.attributes.urls;
    }),
  pauseUserSubscription: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      configureLemonSqueezy();

      // Get user subscriptions
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.lemonSqueezyId, input.id),
      });

      if (!subscription) {
        throw new Error(`Subscription #${input.id} not found.`);
      }

      const returnedSub = await updateSubscription(input.id, {
        pause: {
          mode: "void",
        },
      });

      // Update the db
      try {
        await db
          .update(schema.subscriptions)
          .set({
            status: returnedSub.data?.data.attributes.status,
            statusFormatted: returnedSub.data?.data.attributes.status_formatted,
            endsAt: returnedSub.data?.data.attributes.ends_at,
            isPaused: returnedSub.data?.data.attributes.pause !== null,
          })
          .where(eq(schema.subscriptions.lemonSqueezyId, input.id));
      } catch (error) {
        throw new Error(
          `Failed to pause Subscription #${input.id} in the database.`,
        );
      }

      // revalidatePath("/");

      return returnedSub;
    }),

  resumeUserSubscription: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      configureLemonSqueezy();

      // Get user subscriptions
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.lemonSqueezyId, input.id),
      });

      if (!subscription) {
        throw new Error(`Subscription #${input.id} not found.`);
      }

      const returnedSub = await updateSubscription(input.id, {
        // @ts-expect-error -- null is a valid value for pause
        pause: null,
      });

      // Update the db
      try {
        await db
          .update(schema.subscriptions)
          .set({
            status: returnedSub.data?.data.attributes.status,
            statusFormatted: returnedSub.data?.data.attributes.status_formatted,
            endsAt: returnedSub.data?.data.attributes.ends_at,
            isPaused: returnedSub.data?.data.attributes.pause !== null,
          })
          .where(eq(schema.subscriptions.lemonSqueezyId, input.id));
      } catch (error) {
        throw new Error(
          `Failed to pause Subscription #${input.id} in the database.`,
        );
      }
      // revalidatePath("/");

      return returnedSub;
    }),

  cancelUserSubscription: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      configureLemonSqueezy();

      // Get user subscriptions
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.lemonSqueezyId, input.id),
      });

      if (!subscription) {
        throw new Error(`Subscription #${input.id} not found.`);
      }

      const cancelledSub = await cancelSubscription(input.id);

      // Update the db
      try {
        await db
          .update(schema.subscriptions)
          .set({
            status: cancelledSub.data?.data.attributes.status,
            statusFormatted:
              cancelledSub.data?.data.attributes.status_formatted,
            endsAt: cancelledSub.data?.data.attributes.ends_at,
          })
          .where(eq(schema.subscriptions.lemonSqueezyId, input.id));
      } catch (error) {
        throw new Error(
          `Failed to cancel Subscription #${input.id} in the database.`,
        );
      }
      // revalidatePath("/");

      return cancelledSub;
    }),

  getAllPlans: protectedProcedure.query(() => {
    const sortedPlans = Plans.sort((a, b) => {
      if (
        a.sort === undefined ||
        a.sort === null ||
        b.sort === undefined ||
        b.sort === null
      ) {
        return 0;
      }
      return a.sort - b.sort;
    });
    return sortedPlans;
  }),

  getSubscriptionUrl: protectedProcedure
    .input(
      z.object({
        variantId: z.number(),
        embed: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      configureLemonSqueezy();

      const fetchUser = await ctx.db.query.user.findFirst({
        where: eq(schema.user.clerkUserId, ctx.currentUser),
      });

      const userDetails = fetchUser?.userDetails as UserDetails;

      const checkout = await createCheckout(
        env.LEMONSQUEEZY_STORE_ID,
        input.variantId,
        {
          checkoutOptions: {
            embed: input.embed,
            media: false,
            logo: input.embed,
          },
          checkoutData: {
            email: userDetails.primaryEmail,
            custom: {
              user_id: ctx.currentUser,
            },
          },
          productOptions: {
            enabledVariants: [input.variantId],
            redirectUrl: `${env.DOMAIN}/billing/`,
            receiptButtonText: "Go to Dashboard",
            receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
          },
        },
      );

      return checkout.data?.data.attributes.url;
    }),

  changePlan: protectedProcedure
    .input(
      z.object({
        currentPlanId: z.number(),
        newPlanId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      configureLemonSqueezy();

      // // Get user subscriptions
      // const userSubscriptions = await getUserSubscriptions();

      // // Check if the subscription exists
      // const subscription = userSubscriptions.find(
      //   (sub) => sub.planId === input.currentPlanId,
      // );

      const subscription = await db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.planId, input.currentPlanId),
      });

      if (!subscription) {
        throw new Error(
          `No subscription with plan id #${input.currentPlanId} was found.`,
        );
      }

      // Get the new plan details from the database.

      const newPlan = Plans.find((p) => p.variantId === input.newPlanId);

      if (!newPlan) {
        throw new Error(
          `No plan with variant id #${input.newPlanId} was found.`,
        );
      }

      // Send request to Lemon Squeezy to change the subscription.
      const updatedSub = await updateSubscription(subscription.lemonSqueezyId, {
        variantId: newPlan.variantId,
      });

      // Save in db
      try {
        await db
          .update(schema.subscriptions)
          .set({
            planId: input.newPlanId,
            price: newPlan.price,
            endsAt: updatedSub.data?.data.attributes.ends_at,
          })
          .where(
            eq(
              schema.subscriptions.lemonSqueezyId,
              subscription.lemonSqueezyId,
            ),
          );
      } catch (error) {
        throw new Error(
          `Failed to update Subscription #${subscription.lemonSqueezyId} in the database.`,
        );
      }

      return updatedSub;
    }),

  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.query.subscriptions.findMany({
      where: and(
        eq(schema.subscriptions.userId, ctx.currentUser),
        // or(
        //   like(schema.subscriptions.status, "active"),
        //   like(schema.subscriptions.status, "on_trial"),
        // ),
        gte(schema.subscriptions.endsAt, new Date().toISOString()),
      ),
      // orderBy: { createdAt: "desc" },
    });

    const currentSubscription = subscription[0];

    return currentSubscription;
  }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      configureLemonSqueezy();

      const invoice = await listSubscriptionInvoices({
        filter: {
          subscriptionId: input.id,
        },
      });

      const current = invoice.data?.data[0];

      if (!current) {
        throw new Error(`No invoice found for subscription #${input.id}`);
      }

      const url = current.attributes.urls.invoice_url;

      if (!url) {
        throw new Error(`No invoice URL found for subscription #${input.id}`);
      }

      return url;
    }),
});
