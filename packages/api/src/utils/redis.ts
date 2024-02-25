import { Redis } from "@upstash/redis";

import { env } from "../../env";

export const redis = new Redis({
  url: env.REDISURL,
  token: env.REDISTOKEN,
});
