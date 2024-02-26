import { limitWrapper } from "@api/helpers/limitWrapper";
import { auth } from "twitter-api-sdk";

import type { addTwitterType } from "@aperturs/validators/socials";
import { db, tokens } from "@aperturs/db";

import { env } from "../../../env";

export function GetTwitterConnectUrl(input: addTwitterType) {
  const authClient = new auth.OAuth2User({
    client_id: input.clientId,
    client_secret: input.clientSecret,
    callback: env.TWITTER_CALLBACK_URL,
    scopes: [
      "users.read",
      "tweet.read",
      "offline.access",
      "tweet.write",
      // "follows.read",
      // "follows.write",
    ],
  });
  const url = authClient.generateAuthURL({
    state: `${input.clientId}-${input.clientSecret}`,
    // state: org.id.toString(),
    code_challenge_method: "plain",
    code_challenge: "challenge",
  });
  console.log(url, "url");
  return url;
}

export async function saveTwitterDataToDatabase({
  twitterData,
  userId,
}: {
  twitterData: tokens.twitterTokenInsert;
  userId: string;
}) {
  await limitWrapper(
    () => db.insert(tokens.twitterToken).values(twitterData),
    userId,
    "socialaccounts",
  );
}
