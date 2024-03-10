import { limitWrapper } from "@api/helpers/limitWrapper";
import { googleAuth2Client } from "@api/index";

import type { tokens } from "@aperturs/db";
import { db, eq, schema } from "@aperturs/db";

export const youtubeAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
  ];
  const url = googleAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return url;
};

export async function saveYoutubeDataToDatabase({
  youtubeData,
  userId,
}: {
  youtubeData: tokens.youtubeTokenInsert;
  userId: string;
}) {
  await limitWrapper(
    async () => await db.insert(schema.youtubeToken).values(youtubeData),
    userId,
    "socialaccounts",
  );
}

export async function refreshYoutubeDataInDatabase({
  tokenId,
  youtubeData,
}: {
  tokenId: string;
  youtubeData: tokens.youtubeTokenInsert;
}) {
  await db
    .update(schema.youtubeToken)
    .set(youtubeData)
    .where(eq(schema.youtubeToken.id, tokenId));
}
