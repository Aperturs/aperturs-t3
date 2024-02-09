import { prisma } from "~/server/db";
import { type CreateOrganisation } from "./organisation-types";

export async function createOrganisation({
  name,
  logo,
  clerkID,
}: CreateOrganisation) {
  const res = await prisma.organization
    .create({
      data: {
        name,
        logo,
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
