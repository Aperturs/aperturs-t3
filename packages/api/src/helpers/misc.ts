import type { SavePostInput } from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";

export const ConnectSocial = async ({
  user,
}: {
  user: string;
}): Promise<boolean> => {
  // const accounts = await prisma.user.findUnique({
  //   where: {
  //     clerkUserId: user,
  //   },
  //   select: {
  //     twitterTokens: true,
  //     linkedInTokens: true,
  //   },
  // });
  const accounts = await db.query.user.findFirst({
    where: eq(schema.user.clerkUserId, user),
    with: {
      userTwitterAccounts: true,
      userLinkedinAccounts: true,
    },
  });
  console.log(accounts, "accounts");
  if (accounts) {
    const number =
      accounts.userLinkedinAccounts.length +
      accounts.userTwitterAccounts.length;
    console.log(number, "number");
    if (number < 2) {
      return true;
    }
    return false;
  }
  return true;
};

export const saveDraft = async ({
  user,
  input,
}: {
  user: string;
  input: SavePostInput;
}): Promise<string> => {
  // const savedPost = await prisma.post.create({
  //   data: {
  //     clerkUserId: user,
  //     status: input.scheduledTime ? "SCHEDULED" : "SAVED",
  //     scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
  //     content: input.postContent,
  //   },
  // });

  const [savedPost] = await db
    .insert(schema.post)
    .values({
      clerkUserId: user,
      status: input.scheduledTime ? "SCHEDULED" : "SAVED",
      scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
      content: input.postContent,
      updatedAt: new Date(),
    })
    .returning();
  return savedPost?.id ?? "";
};
