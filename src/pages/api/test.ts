import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const seomthing = req.body;
    
    await prisma.test.create({
        data: {
           // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
           data: `${seomthing}`
        },
    })
    res.status(200).json({ message: "OKAY" });
}
