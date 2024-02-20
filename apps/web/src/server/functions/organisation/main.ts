import type { CreateOrganisation } from "./organisation-types";
import { prisma } from "~/server/db";
import { updateUserPrivateMetadata } from "~/utils/actions/user-private-meta";

export async function createOrganisation({
  name,
  logo,
  clerkID,
  category,
}: CreateOrganisation) {
  const res = await prisma.organization
    .create({
      data: {
        name,
        logo,
        category,
        clerkUserId: clerkID,
        users: {
          create: {
            clerkUserId: clerkID,
            role: "OWNER",
          },
        },
      },
    })
    .catch((e) => {
      throw e;
    });

  if (res) {
    await updateUserPrivateMetadata({
      organisations: [
        {
          orgId: res.id,
          role: "OWNER",
        },
      ],
    });
  }
  return res;
}

export async function getUserOrganisations(clerkID: string) {
  const res = await prisma.organization.findMany({
    where: {
      users: {
        some: {
          clerkUserId: clerkID,
        },
      },
    },
  });
  return res;
}
