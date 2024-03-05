import { FetchPlans } from "@api/handlers/subscription/main";
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
import { getPrice } from "@lemonsqueezy/lemonsqueezy.js";

import type { subscriptions } from "@aperturs/db";
import type { PlansType } from "@aperturs/validators/subscription";
import { db, eq, logs, schema } from "@aperturs/db";

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
          const plan = Plans.map((p) => p).filter(
            (p) => p.variantId.toString() === variantId,
          ) as PlansType[];

          if (plan.length < 1 || !plan[0]) {
            processingError = `Plan with variantId ${variantId} not found.`;
          } else {
            // Update the subscription in the database.

            const priceId = attributes.first_subscription_item.price_id;

            // Get the price data from Lemon Squeezy.
            const priceData = await getPrice(priceId);
            if (priceData.error) {
              processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
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
              planId: plan[0].productId,
            };

            // Create/update subscription in the database.
            try {
              await db
                .insert(schema.subscriptions)
                .values(updateData)
                .onConflictDoUpdate({
                  target: schema.subscriptions.lemonSqueezyId,
                  set: updateData,
                });
            } catch (error) {
              processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database.`;
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
});
