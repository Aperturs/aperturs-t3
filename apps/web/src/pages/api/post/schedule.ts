import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import cronJobServer from "~/server/cronjob";
import { prisma } from "~/server/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  const userId = req.query.userId as string;

  console.log(id);
  // const caller = appRouter.createCaller({
  //   prisma: prisma,
  //   cronJobServer: cronJobServer,
  //   currentUser: userId,
  // });

  // const response = await caller.post.postByPostId({ postId: id });

  res.status(200).json({ message: "nothing for now" });
}
