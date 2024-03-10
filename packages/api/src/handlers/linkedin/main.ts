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
        .delete(schema.linkedInToken)
        .where(eq(schema.linkedInToken.id, tokenId)),
    clerkUserId: userId,
    limitType: "socialaccounts",
  });
}

export async function saveLinkedinDataToDatabase({
  linkedinData,
  userId,
}: {
  linkedinData: tokens.linkedInTokenInsert;
  userId: string;
}) {
  await limitWrapper(
    async () => await db.insert(schema.linkedInToken).values(linkedinData),
    userId,
    "socialaccounts",
  );
}

export async function refreshLinkedinDataInDatabase({
  tokenId,
  linkedinData,
}: {
  tokenId: string;
  linkedinData: tokens.linkedInTokenInsert;
}) {
  await db
    .update(schema.linkedInToken)
    .set(linkedinData)
    .where(eq(schema.linkedInToken.id, tokenId));
}
