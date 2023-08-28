import { prisma } from "~/server/db";
import { type SavePostInput } from "../types";

export const ConnectSocial = async ({
  user,
}: {
  user: string;
}): Promise<boolean> => {
  try {
    const accounts = await prisma.user.findUnique({
      where: {
        clerkUserId: user,
      },
      select: {
        twitterTokens: true,
        linkedInTokens: true,
      },
    });
    if (accounts) {
      const number =
        accounts.linkedInTokens.length + accounts.twitterTokens.length;
      if (number < 2) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    throw error; // or handle it in some other way
  }
};

export const saveDraft = async ({
  user,
  input,
}: {
  user: string;
  input: SavePostInput;
}): Promise<string> => {
  try {
    const savedPost = await prisma.post.create({
      data: {
        clerkUserId: user,
        status: input.scheduledTime ? "SCHEDULED" : "SAVED",
        scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
        defaultContent: input.defaultContent,
        content: input.postContent,
        socialSelected: input.selectedSocials,
      },
    });
    return savedPost.id;
  } catch (error) {
    throw error; // or handle it in some other way
  }
};
