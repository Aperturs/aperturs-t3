import type { User } from "@clerk/nextjs/server";
import type { IncomingHttpHeaders } from "http";
import type { WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { updateUserPrivateMetadata } from "~/utils/actions/user-private-meta";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  console.log(payload, headersList);

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
    await updateUserPrivateMetadata({
      organisations: [],
      currentPlan: "FREE",
    });
    const details = {
      primaryEmail: emailObject.email_address,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      birthday: evt.data.birthday,
      profileImageUrl: evt.data.profile_image_url,
    };

    await prisma.user.create({
      data: {
        clerkUserId: id,
        userDetails: details,
      },
    });
  }
  if (eventType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    const userDetails = {
      primaryEmail: emailObject?.email_address ?? "",
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      birthday: evt.data.birthday,
      profileImageUrl: evt.data.profile_image_url,
    };
    await prisma.user.update({
      where: {
        clerkUserId: id,
      },
      data: {
        userDetails: userDetails,
      },
    });
  }
  if (eventType === "user.deleted") {
    await prisma.user.delete({
      where: {
        clerkUserId: id,
      },
    });
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

export const GET = handler;
export const POST = handler;
export const PUT = handler;
