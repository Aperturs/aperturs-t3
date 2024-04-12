import { Redis } from "@upstash/redis";

import { env } from "../../env";

export const redis = new Redis({
  token: env.REDISTOKEN,
  url: env.REDISURL,
});
