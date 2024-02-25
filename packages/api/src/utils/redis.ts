import { Redis } from "@upstash/redis";

// import {Redis} from 'ioredis'

import { env } from "../../env";

// export const redis = new Redis({
//   url: env.REDISURL,
//   token: env.REDISTOKEN,
// });

export const redis = new Redis({
  token: env.REDISTOKEN,
  url: env.REDISURL,
});
