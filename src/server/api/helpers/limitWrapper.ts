import { type UserUsage } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";

type LimitType = keyof Omit<
  UserUsage,
  "clerkUserId" | "createdAt" | "updatedAt"
>;

// type AsyncFunction<T> = () => Promise<T>;

export async function limitWrapper<T>(
  func: () => Promise<T>,
  clerkUserId: string,
  limitType: LimitType
): Promise<T> {
  // Fetch the user's usage data
  const userUsage = await prisma.userUsage.findUnique({
    where: { clerkUserId },
  });

  if (!userUsage) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  // Check if the user has reached their limit
  if (userUsage[limitType] <= 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "You have reached your daily limit",
    });
  }

  // Execute the function
  const result = await func();

  // If the function was successful, decrement the current usage count
  await prisma.userUsage.update({
    where: { clerkUserId },
    data: { [limitType]: { decrement: 1 } },
  });

  return result;
}
