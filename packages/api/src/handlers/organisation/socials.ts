import { db, eq, schema } from "@aperturs/db";

export async function getSocialAccounts(orgId: string) {
  const res = await db.query.socialProvider.findMany({
    where: eq(schema.socialProvider.organizationId, orgId),
  });
  return res;
}

export async function getOrganisationsYoutubeAccounts(orgId: string) {
  const res = await db.query.youtubeToken.findMany({
    where: eq(schema.youtubeToken.organizationId, orgId),
  });
  return res;
}
