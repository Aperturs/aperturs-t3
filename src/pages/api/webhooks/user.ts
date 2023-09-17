import type { User } from "@clerk/nextjs/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers";

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
}

const webhookSecret: string = env.WEBHOOK_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await req.body;

  const payloadString = JSON.stringify(payload);
  const headerPayload = req.headers;
  const svixId = headerPayload["svix-id"] as string;
  const svixIdTimeStamp = headerPayload["svix-timestamp"] as string;
  const svixSignature = headerPayload["svix-signature"] as string;
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    return res.status(500).json({ message: "Error Happended" });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (err) {
    console.log("error");
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  // Handle the webhook
  const eventType: EventType = evt.type;
  if (
    eventType === "user.created"
    //  || eventType === "user.updated" (for now we dont need to check for updating, it for no reasons makes more prisma calls )
  ) {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return res.status(500).json({ message: "no email found" });
    }

    const details = {
      primaryEmail: emailObject.email_address,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      birthday: evt.data.birthday,
    };
    // await caller.user.createUser({
    //   clerkId: id,
    //   details: attributes
    // });
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
      primaryEmail: emailObject?.email_address || "",
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      phoneNumber: evt.data.phone_numbers,
      birthday: evt.data.birthday,
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
  return res.status(200).json({ message: "ok" });
}

type Event = {
  data: UserInterface;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "user.deleted";
