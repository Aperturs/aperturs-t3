import type { SavePostInput } from "../../../types/post-types";
import { prisma } from "~/server/db";

export const ConnectSocial = async ({
  user,
}: {
  user: string;
}): Promise<boolean> => {
  const accounts = await prisma.user.findUnique({
    where: {
      clerkUserId: user,
    },
    select: {
      twitterTokens: true,
      linkedInTokens: true,
    },
  });
  console.log(accounts, "accounts");
  if (accounts) {
    const number =
      accounts.linkedInTokens.length + accounts.twitterTokens.length;
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
  const savedPost = await prisma.post.create({
    data: {
      clerkUserId: user,
      status: input.scheduledTime ? "SCHEDULED" : "SAVED",
      scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
      content: input.postContent,
    },
  });
  return savedPost.id;
};
