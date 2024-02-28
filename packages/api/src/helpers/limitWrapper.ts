import { TRPCError } from "@trpc/server";

import type { user } from "@aperturs/db";
import { db, eq, schema } from "@aperturs/db";

type LimitType = keyof Omit<
  user.UserUsageSelect,
  "clerkUserId" | "createdAt" | "updatedAt"
>;

// type AsyncFunction<T> = () => Promise<T>;

export async function limitWrapper<T>(
  func: () => Promise<T>,
  clerkUserId: string,
  limitType: LimitType,
): Promise<T> {
  // Fetch the user's usage data

  const userUsage = await db.query.userUsage.findFirst({
    where: eq(schema.userUsage.clerkUserId, clerkUserId),
  });

  if (!userUsage) {
    await db.insert(schema.userUsage).values({
      clerkUserId: clerkUserId,
      updatedAt: new Date(),
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
  await db
    .update(schema.userUsage)
    .set({
      [limitType]: userUsage[limitType] - 1,
      updatedAt: new Date(),
    })
    .where(eq(schema.userUsage.clerkUserId, clerkUserId));

  console.log("limiting down for user", clerkUserId, limitType);

  return result;
}

export async function limitDown<T>({
  func,
  clerkUserId,
  limitType,
}: {
  func: () => Promise<T> | T;
  clerkUserId: string;
  limitType: LimitType;
}): Promise<T> {
  const userUsage = await db.query.userUsage.findFirst({
    where: eq(schema.userUsage.clerkUserId, clerkUserId),
  });

  if (!userUsage) {
    await db.insert(schema.userUsage).values({
      clerkUserId: clerkUserId,
      updatedAt: new Date(),
    });

    return limitDown({ func, clerkUserId, limitType });
  }

  const result = func();

  await db
    .update(schema.userUsage)
    .set({
      [limitType]: userUsage[limitType] + 1,
      updatedAt: new Date(),
    })
    .where(eq(schema.userUsage.clerkUserId, clerkUserId));

  return result;
}

export async function verifyLimitAndRun<T>({
  func,
  clerkUserId,
  limitType,
}: {
  func: () => Promise<T> | T;
  clerkUserId: string;
  limitType: LimitType;
}): Promise<T> {
  const userUsage = await db.query.userUsage.findFirst({
    where: eq(schema.userUsage.clerkUserId, clerkUserId),
  });
  if (!userUsage) {
    await db.insert(schema.userUsage).values({
      clerkUserId: clerkUserId,
      updatedAt: new Date(),
    });
    return verifyLimitAndRun({ func, clerkUserId, limitType });
  }
  if (userUsage[limitType] <= 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "You have reached your limit",
    });
  }
  const result = await func();

  return result;
}
