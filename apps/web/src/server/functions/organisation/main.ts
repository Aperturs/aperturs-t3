import { prisma } from "~/server/db";
import { type CreateOrganisation } from "./organisation-types";

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
      clerkUserId: clerkID,
    },
  });

  return res;
}
