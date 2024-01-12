import { getAuth } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  console.log("working twitter", userId);
  return res.redirect("/dashboard");
}
