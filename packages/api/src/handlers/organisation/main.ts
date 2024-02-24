import { updateUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";

import type { CreateOrganisation } from "@aperturs/validators/organisation";
import { db, eq, schema } from "@aperturs/db";

export async function createOrganisation({
  name,
  logo,
  clerkID,
  category,
}: CreateOrganisation) {
  const resp = await db.transaction(async (tx) => {
    const [res] = await tx
      .insert(schema.organization)
      .values({
        name,
        logo,
        category,
        clerkUserId: clerkID,
        updatedAt: new Date(),
      })
      .returning();
    await tx.insert(schema.organizationUser).values({
      clerkUserId: clerkID,
      organizationId: res?.id ?? "",
      role: "OWNER",
      updatedAt: new Date(),
    });
    return res;
  });
  if (resp) {
    await updateUserPrivateMetadata({
      organisations: [
        {
          orgId: resp.id,
          role: "OWNER",
        },
      ],
    });
  }
  return resp;
}

export async function getUserOrganisations(clerkID: string) {
  const res = await db.query.organizationUser.findMany({
    where: eq(schema.organizationUser.clerkUserId, clerkID),
    with: {
      organization: true,
    },
  });
  return res;
}
