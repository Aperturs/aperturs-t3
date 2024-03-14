import { removeUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";
import { resend } from "@api/utils/emails";

import type {
  InviteUserToOrganisation,
  OrganisationRole,
  sendInvitationViaEmailType,
} from "@aperturs/validators/organisation";
import { db, eq, schema } from "@aperturs/db";
import { InviteUserEmail } from "@aperturs/email/invite-user";

import { env } from "../../../env";

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
  inviteId,
}: InviteUserToOrganisation) {
  const [res] = await db
    .insert(schema.organizationInvites)
    .values({
      id: inviteId,
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
    inviteUrl: `${env.DOMAIN}/organisation/invite/${invitationId}`,
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
  const res = await db.query.organizationInvites.findFirst({
    where: eq(schema.organizationInvites.id, inviteId),
  });
  if (!res) {
    return undefined;
  }
  const orgDetails = await db.query.organization.findFirst({
    where: eq(schema.organization.id, res?.organizationId),
  });
  return {
    inviteDetails: res,
    orgDetails,
  };
}

export async function organisationMembershipAdded({
  orgId,
  userId,
  role,
}: {
  orgId: string;
  userId: string;
  role: OrganisationRole;
}) {
  const [user] = await db
    .insert(schema.organizationUser)
    .values({
      organizationId: orgId,
      clerkUserId: userId,
      role: role,
      updatedAt: new Date(),
    })
    .returning();

  return user;
}

export async function acceptInvite({ inviteId }: { inviteId: string }) {
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
  // const orgId = res.organizationId;
  // const role = res.role;
  // const [user] = await db
  //   .insert(schema.organizationUser)
  //   .values({
  //     organizationId: orgId,
  //     clerkUserId: userId,
  //     role: role,
  //     updatedAt: new Date(),
  //   })
  //   .returning();
  // await updateUserPrivateMetadata({
  //   organisations: [
  //     {
  //       orgId: orgId,
  //       role: role,
  //     },
  //   ],
  // });
  return {
    res,
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
