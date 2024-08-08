import type { User } from "@clerk/nextjs/server";
import type { IncomingHttpHeaders } from "http";
import type { WebhookRequiredHeaders } from "svix";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { db, eq, schema } from "@aperturs/db";

import { env } from "~/env";
import { api } from "~/trpc/server";

const webhookSecret = env.WEBHOOK_SECRET || "";

type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers"
  | "profileImageUrl";

interface UserInterface extends Omit<User, UnwantedKeys> {
  email_addresses: {
    email_address: string;
    id: string;
  }[];
  primary_email_address_id: string;
  first_name: string;
  last_name: string;
  primary_phone_number_id: string;
  phone_numbers: {
    phone_number: string;
    id: string;
  }[];
  profile_image_url: string;
}

async function handler(request: Request) {
  console.log("request", request);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await request.json();
  const headersAll = request.headers;
  console.log("headersList", headersAll);
  const heads = {
    "svix-id": headersAll.get("svix-id"),
    "svix-timestamp": headersAll.get("svix-timestamp"),
    "svix-signature": headersAll.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  console.log(payload, headersAll);

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders,
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      {
        message: "Error occured from webhook",
      },
      { status: 400 },
    );
  }

  const eventType: EventType = evt.type;
  const { id } = evt.data;
  if (eventType === "user.created") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return NextResponse.json(
        {
          message: "Primary email not found",
        },
        { status: 400 },
      );
    }
    // await updateUserPrivateMetadata({
    //   organisations: [],
    //   currentPlan: "FREE",
    // });
    await api.metadata.updateUserPrivateMetaData({
      organisations: [],
      currentPlan: "FREE",
      userId: id,
    });
    const details = {
      primaryEmail:
        emailObject.email_address ?? evt.data.primaryEmailAddress?.emailAddress,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      profileImageUrl: evt.data.profile_image_url,
    };

    // await prisma.user.create({
    //   data: {
    //     clerkUserId: id,
    //     userDetails: details,
    //   },
    // });
    await db.insert(schema.user).values({
      clerkUserId: id,
      userDetails: details,
      updatedAt: new Date(),
    });
  }
  if (eventType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    const userDetails = {
      primaryEmail:
        emailObject?.email_address ??
        evt.data.primaryEmailAddress?.emailAddress,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      profileImageUrl: evt.data.profile_image_url,
    };

    await db
      .update(schema.user)
      .set({
        userDetails,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.clerkUserId, id));
  }
  if (eventType === "user.deleted") {
    await db.delete(schema.user).where(eq(schema.user.clerkUserId, id));
  }
  return NextResponse.json({
    message: "ok",
  });
}

type EventType = "user.created" | "user.updated" | "user.deleted";

interface Event {
  data: UserInterface;
  object: "event";
  type: EventType;
}

export const POST = handler;
export const PUT = handler;
