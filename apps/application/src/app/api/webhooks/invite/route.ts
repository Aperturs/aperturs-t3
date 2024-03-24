import type { WebhookEvent } from "@clerk/nextjs/server";
import type { IncomingHttpHeaders } from "http";
import type { WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import type { OrganisationRole } from "@aperturs/validators/organisation";

import { env } from "~/env";
import { api } from "~/trpc/server";

const webhookSecret = env.INIVITE_WEBHOOK || "";

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
  let evt: WebhookEvent | null = null;

  console.log(payload, headersList);

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders,
    ) as WebhookEvent;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json(
      {
        message: "Error occured from webhook",
      },
      { status: 400 },
    );
  }

  if (!evt) {
    return NextResponse.json(
      {
        message: "Error occured from webhook",
      },
      { status: 400 },
    );
  }

  if (evt.type === "organizationInvitation.accepted") {
    await api.organisation.team.acceptInvite({
      inviteId: evt.data.id,
    });
  }
  // if (evt.type === "organizationInvitation.created") {
  //   await api.organisation.team.inviteUserToOrganisation({
  //     email: evt.data.email_address,
  //     orgId: evt.data.organization_id,
  //     role: evt.data.role.toUpperCase() as OrganisationRole,
  //     name: "test",
  //   });
  // }
  if (evt.type === "organizationInvitation.revoked") {
    await api.organisation.team.cancelInvite({
      inviteId: evt.data.id,
    });
  }
  if (evt.type === "organizationMembership.created") {
    await api.organisation.team.organisationMembershipCreated({
      orgId: evt.data.organization.slug!,
      role: evt.data.role
        .toUpperCase()
        .replace(/^ORG:/, "") as OrganisationRole,
      userId: evt.data.public_user_data.user_id,
    });
  }

  return NextResponse.json({
    message: "ok",
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
