import {
  removeUserPrivateMetadata,
  updateUserPrivateMetadata,
} from "@api/handlers/metadata/user-private-meta";
import { resend } from "@api/utils/emails";

import type {
  InviteUserToOrganisation,
  sendInvitationViaEmailType,
} from "@aperturs/validators/organisation";
// import { prisma } from "~/server/db";
import { db, eq, schema } from "@aperturs/db";
import { InviteUserEmail } from "@aperturs/email/invite-user";

export async function getOrgnanisationTeams(orgId: string) {
  const res = await db.query.organizationUser.findMany({
    where: eq(schema.organizationUser.organizationId, orgId),
    with: {
      user: true,
    },
  });
  return res;
}

export async function removeUserFromOrganisation(orgUserId: string) {
  const [res] = await db
    .delete(schema.organizationUser)
    .where(eq(schema.organizationUser.id, orgUserId))
    .returning();
  if (!res) {
    throw new Error("Error deleting user from organisation");
  }
  await removeUserPrivateMetadata({
    orgId: res.organizationId,
    role: res.role,
  });
  return res;
}

export async function inviteUserToOrganisation({
  orgId,
  email,
  role,
  name,
  inviterId,
  inviterName,
}: InviteUserToOrganisation) {
  // const res = await prisma.organizationInvites.create({
  //   data: {
  //     email,
  //     role,
  //     name,
  //     inviterClerkId: inviterId,
  //     inviterName: inviterName,
  //     organizationId: orgId,
  //     status: "PENDING",
  //   },
  // });
  const [res] = await db
    .insert(schema.organizationInvites)
    .values({
      email,
      role,
      name,
      inviterClerkId: inviterId,
      inviterName: inviterName,
      organizationId: orgId,
      status: "PENDING",
      updatedAt: new Date(),
    })
    .returning();
  if (!res) {
    throw new Error("Error inviting user to organisation");
  }
  return res;
}

export async function sendInvitationViaEmail({
  invitationId,
  teamName,
  userImage,
  teamImage,
  userName,
  toEmail,
  invitedByName,
}: sendInvitationViaEmailType) {
  const reactSendEmail = InviteUserEmail({
    userName: userName,
    userImage: userImage,
    invitedByName: invitedByName,
    teamName: teamName,
    teamImage: teamImage,
    inviteUrl: `http://localhost:3000/organisation/invite/${invitationId}`,
  });
  const email = await resend.emails
    .send({
      to: toEmail,
      from: "Aperturs <noreply@aperturs.com>",
      react: reactSendEmail,
      subject: `You have been invited to join ${teamName} on Aperturs`,
    })
    .catch((e) => {
      console.error(e);
    });
  console.log(email);
}

export async function getInviteDetails({ inviteId }: { inviteId: string }) {
  // const res = await prisma.organizationInvites.findUnique({
  //   where: {
  //     id: inviteId,
  //   },
  // });
  const res = await db.query.organizationInvites.findFirst({
    where: eq(schema.organizationInvites.id, inviteId),
  });
  if (!res) {
    return undefined;
  }
  // const orgDetails = await prisma.organization.findUnique({
  //   where: {
  //     id: res?.organizationId,
  //   },
  // });
  const orgDetails = await db.query.organization.findFirst({
    where: eq(schema.organization.id, res?.organizationId),
  });
  return {
    inviteDetails: res,
    orgDetails,
  };
}

export async function acceptInvite({
  inviteId,
  userId,
}: {
  inviteId: string;
  userId: string;
}) {
  //TODO: add transactions rollback
  const [res] = await db
    .update(schema.organizationInvites)
    .set({
      status: "ACCEPTED",
    })
    .where(eq(schema.organizationInvites.id, inviteId))
    .returning();
  if (!res) {
    throw new Error("Error accepting invite");
  }
  const orgId = res.organizationId;
  const role = res.role;
  const [user] = await db
    .insert(schema.organizationUser)
    .values({
      organizationId: orgId,
      clerkUserId: userId,
      role: role,
      updatedAt: new Date(),
    })
    .returning();
  await updateUserPrivateMetadata({
    organisations: [
      {
        orgId: orgId,
        role: role,
      },
    ],
  });
  return {
    res,
    user,
  };
}

export async function rejectInvite({ inviteId }: { inviteId: string }) {
  // const res = await prisma.organizationInvites.update({
  //   where: {
  //     id: inviteId,
  //   },
  //   data: {
  //     status: "REJECTED",
  //   },
  // });
  const [res] = await db
    .update(schema.organizationInvites)
    .set({
      status: "REJECTED",
    })
    .where(eq(schema.organizationInvites.id, inviteId))
    .returning();
  return res;
}
