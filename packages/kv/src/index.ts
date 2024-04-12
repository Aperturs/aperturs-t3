import "server-only";

import { Redis } from "@upstash/redis";

export const redis = new Redis({
  token: process.env.REDISTOKEN!,
  url: process.env.REDISURL!,
});
