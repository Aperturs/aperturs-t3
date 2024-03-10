import { google } from "googleapis";

import { env } from "../../env";

export const googleAuth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_YT_CALLBACK_URL,
);

export const youtubeClient = google.youtube({
  version: "v3",
  auth: googleAuth2Client,
});
