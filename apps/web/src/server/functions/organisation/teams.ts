import { InviteUserEmail } from "@aperturs/email/emails/invite-user";

import type {
  InviteUserToOrganisation,
  sendInvitationViaEmailType,
} from "./organisation-types";
import { prisma } from "~/server/db";
import { resend } from "~/server/emails/resend";
import { addUserPrivateMetadata, removeUserPrivateMetadata } from "~/utils/actions/user-private-meta";

export async function getOrgnanisationTeams(orgId: string) {
  const res = await prisma.organizationUser.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      user: true,
    },
  });
  return res;
}

export async function removeUserFromOrganisation(orgUserId: string) {
  const res = await prisma.organizationUser.delete({
    where: {
      id: orgUserId,
    },
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
  const res = await prisma.organizationInvites.create({
    data: {
      email,
      role,
      name,
      inviterClerkId: inviterId,
      inviterName: inviterName,
      organizationId: orgId,
      status: "PENDING",
    },
  });
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
    inviteUrl: `http://localhost:3000/invite/${invitationId}`,
    inviteFromIp: "204.13.186.218",
    inviteFromLocation: "São Paulo, Brazil",
    appLogo: "/logo.svg",
  });
  const email = await resend.emails
    .send({
      to: toEmail,
      from: "Swaraj <rajswaraj.r@gmail.com>",
      react: reactSendEmail,
      subject: `You have been invited to join ${teamName} on Aperturs`,
    })
    .catch((e) => {
      console.error(e);
    });
  console.log(email);
}

export async function getInviteDetails({ inviteId }: { inviteId: string }) {
  const res = await prisma.organizationInvites.findUnique({
    where: {
      id: inviteId,
    },
  });
  if (!res) {
    return undefined;
  }
  const orgDetails = await prisma.organization.findUnique({
    where: {
      id: res?.organizationId,
    },
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
  const res = await prisma.organizationInvites.update({
    where: {
      id: inviteId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
  const orgId = res.organizationId;
  const role = res.role;
  const user = await prisma.organizationUser.create({
    data: {
      organizationId: orgId,
      clerkUserId: userId,
      role: role,
    },
  });
  await addUserPrivateMetadata({
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
  const res = await prisma.organizationInvites.update({
    where: {
      id: inviteId,
    },
    data: {
      status: "REJECTED",
    },
  });
  return res;
}
