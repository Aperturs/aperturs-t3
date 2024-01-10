import { env } from "~/env.mjs";

import { LemonSqueezy } from "@lemonsqueezy/lemonsqueezy.js";
const ls = new LemonSqueezy(env.NEXT_PRIVATE_LEMONSQUEEZY_KEY);

export default ls;
