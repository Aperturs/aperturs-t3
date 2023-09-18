import { getAuth } from "@clerk/nextjs/server";
import { type NextApiRequest } from "next/types";

export default function handler(req: NextApiRequest) {
  const { userId } = getAuth(req);
  console.log("working twitter", userId);
}
