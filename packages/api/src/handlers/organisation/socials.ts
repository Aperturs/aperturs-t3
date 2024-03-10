import { db, eq, schema } from "@aperturs/db";

export async function getOrganisationsLinkedinAccounts(orgId: string) {
  const res = await db.query.linkedInToken.findMany({
    where: eq(schema.linkedInToken.organizationId, orgId),
  });
  return res;
}

export async function getOrganisationsTwitterAccounts(orgId: string) {
  const res = await db.query.twitterToken.findMany({
    where: eq(schema.twitterToken.organizationId, orgId),
  });
  return res;
}

export async function getOrganisationsGithubAccounts(orgId: string) {
  const res = await db.query.githubToken.findMany({
    where: eq(schema.githubToken.organizationId, orgId),
  });
  return res;
}

export async function getOrganisationsYoutubeAccounts(orgId: string) {
  const res = await db.query.youtubeToken.findMany({
    where: eq(schema.youtubeToken.organizationId, orgId),
  });
  return res;
}
