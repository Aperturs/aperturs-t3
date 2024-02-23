import type { UserUsage } from "@prisma/client";
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
  limitType: LimitType,
): Promise<T> {
  // Fetch the user's usage data
  const userUsage = await prisma.userUsage.findUnique({
    where: { clerkUserId },
  });

  if (!userUsage) {
    // If the user doesn't have any usage data, create it
    await prisma.userUsage.create({
      data: { clerkUserId },
    });
    return limitWrapper(func, clerkUserId, limitType);
  }

  // Check if the user has reached their limit
  if (userUsage[limitType] <= 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "You have reached your limit",
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

export async function limitDown<T>(
  func: () => Promise<T>,
  clerkUserId: string,
  limitType: LimitType,
): Promise<T> {
  const userUsage = await prisma.userUsage.findUnique({
    where: { clerkUserId },
  });
  if (!userUsage) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const result = func();

  await prisma.userUsage.update({
    where: { clerkUserId },
    data: { [limitType]: { increment: 1 } },
  });

  return result;
}
