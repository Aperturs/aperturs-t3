import { prisma } from "~/server/db";

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
