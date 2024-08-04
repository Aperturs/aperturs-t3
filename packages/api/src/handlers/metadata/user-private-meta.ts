import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import type { ChangeUserRoleWithOrgIdType } from "@aperturs/validators/organisation";
import type { PrivateMetaData } from "@aperturs/validators/private_metadata";

export async function updateUserPrivateMetadata(
  data: Partial<PrivateMetaData>,
) {
  const { userId, user } = auth();
  const id = userId ?? data.userId;
  if (!id) {
    throw new Error("No user ID found");
  }

  const metadata = user?.privateMetadata as PrivateMetaData;

  let updatedOrganisations = [];

  if (metadata?.organisations) {
    updatedOrganisations = [
      ...metadata.organisations,
      ...(data.organisations ?? []),
    ];
  } else {
    updatedOrganisations = [...(data.organisations ?? [])];
  }
  await clerkClient.users.updateUserMetadata(id, {
    privateMetadata: {
      organisations: updatedOrganisations,
      lsSubscriptionId: data.lsSubscriptionId,
      lsCustomerId: data.lsCustomerId,
      lsVariantId: data.lsVariantId,
      lsCurrentPeriodEnd: data.lsCurrentPeriodEnd,
      currentPlan: data.currentPlan,
    },
    publicMetadata: {
      currentPlan: data.currentPlan,
    },
  });
}

export function getUserPrivateMetadata() {
  const { userId, user } = auth();
  if (!userId) {
    throw new Error("No user ID found");
  }
  const metadata = user?.privateMetadata as PrivateMetaData;
  return metadata;
}

export async function changeUserRoleMetaData(
  data: ChangeUserRoleWithOrgIdType,
) {
  const { userId, user } = auth();
  if (!userId) {
    throw new Error("No user ID found");
  }
  const metadata = user?.privateMetadata as PrivateMetaData;
  if (!metadata?.organisations) {
    throw new Error("No organisations found");
  }
  const updatedOrganisations = metadata.organisations.map((org) => {
    if (org.orgId === data.orgId) {
      return {
        ...org,
        role: data.newRole,
      };
    }
    return org;
  });

  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      organisations: updatedOrganisations,
    },
  });
}

export async function removeUserPrivateMetadata(data: {
  orgId: string;
  role: string;
}) {
  const { userId, user } = auth();
  if (!userId) {
    throw new Error("No user ID found");
  }
  const metadata = user?.privateMetadata as PrivateMetaData;
  if (!metadata?.organisations) {
    throw new Error("No organisations found");
  }
  const updatedOrganisations = metadata.organisations.filter(
    (org) => org.orgId !== data.orgId,
  );

  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      organisations: updatedOrganisations,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getUserRole({ orgId }: { orgId: string }) {
  const { userId, user } = auth();
  if (!userId) {
    throw new Error("No user ID found");
  }
  const metadata = user?.privateMetadata as PrivateMetaData;
  if (!metadata?.organisations) {
    throw new Error("No organisations found");
  }
  const org = metadata.organisations.find((org) => org.orgId === orgId);
  return org?.role;
}
