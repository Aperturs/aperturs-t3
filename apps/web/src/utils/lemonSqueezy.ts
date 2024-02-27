import { LemonSqueezy } from "@lemonsqueezy/lemonsqueezy.js";

import { env } from "~/env";

// import { LemonsqueezyClient } from "lemonsqueezy.ts";

const ls = new LemonSqueezy(env.NEXT_PRIVATE_LEMONSQUEEZY_KEY);

// const lsClient = new LemonsqueezyClient(env.NEXT_PRIVATE_LEMONSQUEEZY_KEY);

export default ls;
