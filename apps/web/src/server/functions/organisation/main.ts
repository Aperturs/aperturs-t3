import type { CreateOrganisation } from "./organisation-types";
import { prisma } from "~/server/db";

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
