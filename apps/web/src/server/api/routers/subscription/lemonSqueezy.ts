import { z } from "zod";
import ls from "~/utils/lemonSqueezy";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const subscriptionData = createTRPCRouter({
  getProducts: protectedProcedure.query(async ({}) => {
    const products = await ls.getProducts();
    return products;
  }),
  createCheckout: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attributes = {
        checkout_data: {
          email: "swarajkumar4444@gmail.com",
          // discount_code: "10PERCENT",
          custom: {
            user_id: ctx.currentUser,
          },
        },
        product_options: {
          redirect_url: "http://localhost:3000",
        },
        checkout_options: {
          dark: true,
          logo: false,
        },
      };

      // const producst = await ls.getProducts();

      const variant = await ls.getVariants({
        productId: input.productId,
      });

      const variantId = variant.data[1]?.id;

      if (!variantId) {
        throw new Error("Invalid product");
      }

      // const checkout = await ls.createCheckout({
      //   storeId: 44820,
      //   variantId: parseInt(variantId),
      //   attributes,
      // });
      const checkout = await ls.updateSubscription({
        id: 243297,
        productId: input.productId,
        variantId: parseInt(variantId),
        proration: "immediate",
      });

      console.log(checkout.data, "testing");

      return checkout.data.attributes;
    }),

  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user
      .findUnique({
        where: { clerkUserId: ctx.currentUser },
        select: {
          lsSubscriptionId: true,
          lsCurrentPeriodEnd: true,
          lsCustomerId: true,
          lsVariantId: true,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    if (!user) throw new Error("User not found");

    // Check if user is on a pro plan.
    const isPro =
      user.lsVariantId &&
      user.lsCurrentPeriodEnd &&
      user.lsCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();

    if (!user.lsSubscriptionId) {
      return {
        isPro: false,
        isCanceled: false,
        lsCurrentPeriodEnd: null,
        subscription: null,
        updatePaymentMethodURL: null,
      };
    }

    const subscription = await ls.getSubscription({
      id: parseInt(user.lsSubscriptionId ?? "0"),
    });

    // If user has a pro plan, check cancel status on Stripe.
    let isCanceled = false;

    if (isPro && user.lsSubscriptionId) {
      isCanceled = subscription.data.attributes.cancelled;
    }

    return {
      ...user,
      lsCurrentPeriodEnd: user.lsCurrentPeriodEnd?.getTime(),
      isCanceled,
      isPro,
      updatePaymentMethodURL:
        subscription.data.attributes.urls.update_payment_method,
      subscription,
    };
  }),
});
