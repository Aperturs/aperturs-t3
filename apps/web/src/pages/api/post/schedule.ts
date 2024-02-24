import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  // const userId = req.query.userId as string;

  console.log(id);
  // const caller = appRouter.createCaller({
  //   prisma: prisma,
  //   cronJobServer: cronJobServer,
  //   currentUser: userId,
  // });

  // const response = await caller.post.postByPostId({ postId: id });

  res.status(200).json({ message: "nothing for now" });
}
