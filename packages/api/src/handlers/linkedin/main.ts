import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";

import type { tokens } from "@aperturs/db";
import { db, eq, schema } from "@aperturs/db";

export async function removeLinkedinDataFromDatabase({
  tokenId,
  userId,
}: {
  tokenId: string;
  userId: string;
}) {
  await limitDown({
    func: async () =>
      await db
        .delete(schema.socialProvider)
        .where(eq(schema.socialProvider.id, tokenId)),
    clerkUserId: userId,
    limitType: "socialaccounts",
  });
}

export async function saveLinkedinDataToDatabase({
  linkedinData,
  userId,
}: {
  linkedinData: tokens.SocialProviderInsertType;
  userId: string;
}) {
  await limitWrapper(
    async () => await db.insert(schema.socialProvider).values(linkedinData),
    userId,
    "socialaccounts",
  );
}

export async function refreshLinkedinDataInDatabase({
  tokenId,
  linkedinData,
}: {
  tokenId: string;
  linkedinData: tokens.SocialProviderInsertType;
}) {
  await db
    .update(schema.socialProvider)
    .set(linkedinData)
    .where(eq(schema.socialProvider.id, tokenId));
}
