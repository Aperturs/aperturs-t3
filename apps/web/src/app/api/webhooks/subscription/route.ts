/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Buffer } from "buffer";
import crypto from "crypto";
import { Readable } from "stream";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import rawBody from "raw-body";

import { prisma } from "~/server/db";
import ls from "~/utils/lemonSqueezy";

export async function POST(request: Request) {
  const body = await rawBody(Readable.from(Buffer.from(await request.text())));
  const headersList = headers();
  const payload = JSON.parse(body.toString());
  const sigString = headersList.get("x-signature");
  const secret = process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signature = Buffer.from(
    Array.isArray(sigString) ? sigString.join("") : sigString ?? "",
    "utf8",
  );

  // Check if the webhook event was for this product or not
  // if (
  //   parseInt(payload.data.attributes.product_id) !==
  //   parseInt(process.env.LEMONS_SQUEEZY_PRODUCT_ID as string)
  // ) {
  //   return NextResponse.json({ message: "Invalid product" }, { status: 403 });
  // }

  // validate signature
  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  const userId = payload.meta.custom_data.user_id;
  console.log(payload.meta.custom_data.user_id);

  // Check if custom defined data i.e. the `userId` is there or not
  if (!userId) {
    return NextResponse.json(
      { message: "No userId provided" },
      { status: 403 },
    );
  }

  switch (payload.meta.event_name) {
    case "subscription_created": {
      const subscription = await ls.getSubscription({ id: payload.data.id });

      await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          currentPlan: "PRO",
          lsSubscriptionId: `${subscription.data.id}`,
          lsCustomerId: `${payload.data.attributes.customer_id}`,
          lsVariantId: subscription.data.attributes.variant_id,
          lsCurrentPeriodEnd: new Date(
            subscription.data.attributes.renews_at ?? "",
          ),
        },
      });

      return NextResponse.json(
        { message: "Success Subscription Created" },
        { status: 200 },
      );
    }

    case "subscription_updated": {
      const subscription = await ls.getSubscription({ id: payload.data.id });

      const user = await prisma.user.findUnique({
        where: { lsSubscriptionId: `${subscription.data.id}` },
        select: { lsSubscriptionId: true },
      });

      if (!user?.lsSubscriptionId) return;

      await prisma.user.update({
        where: { lsSubscriptionId: user.lsSubscriptionId },
        data: {
          lsVariantId: subscription.data.attributes.variant_id,
          lsCurrentPeriodEnd: subscription.data.attributes.renews_at,
        },
      });

      return NextResponse.json(
        { message: "Success Subscription Updated" },
        { status: 200 },
      );
    }
  }
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
