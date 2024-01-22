import ls from "~/utils/lemonSqueezy";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const subscriptionData = createTRPCRouter({
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    const products = await ls.getProducts();
    return products;
  }),
  createCheckout: protectedProcedure.mutation(async ({ ctx, input }) => {
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

    const producst = await ls.getProducts();
    console.log(producst);

    const variant = await ls.getVariants({
      productId: 113580,
    });

    console.log(variant);

    const checkout = await ls.createCheckout({
      storeId: 44820,
      variantId: 129354,
      attributes,
    });

    return checkout.data.attributes.url;
  }),
});
