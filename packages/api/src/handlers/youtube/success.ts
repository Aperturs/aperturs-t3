import { resend } from "@api/utils/emails";

import type { UserDetails } from "@aperturs/validators/user";
import { db, eq, schema } from "@aperturs/db";
import { YoutubeSuccessEmail } from "@aperturs/email/youtube-success";

export async function sendSuccessEmailYoutube({
  postid,
  youtubeurl,
}: {
  postid: string;
  youtubeurl: string;
}) {
  const post = await db.query.post.findFirst({
    where: eq(schema.post.id, postid),
    with: {
      youtubeContent: true,
      organization: true,
    },
  });

  if (!post?.youtubeContent) {
    throw new Error("Youtube content not found");
  }

  if (!post.organization?.clerkUserId) {
    throw new Error("Youtube token not found");
  }

  const title = post.youtubeContent.title;
  const description = post.youtubeContent.description;
  const user = await db.query.user.findFirst({
    where: eq(schema.user.clerkUserId, post.organization.clerkUserId),
  });
  const userdetails = user?.userDetails as UserDetails;
  const email = userdetails.primaryEmail;

  const youtubeSuccessEmail = YoutubeSuccessEmail({
    title,
    description,
    youtubeUrl: youtubeurl,
  });

  const mail = await resend.emails
    .send({
      to: email,
      from: "Aperturs <noreply@aperturs.com>",
      react: youtubeSuccessEmail,
      subject: `Your video with title ${title} has been successfully uploaded to Youtube`,
    })
    .catch((e) => {
      console.error(e);
    });

  return mail;
}
