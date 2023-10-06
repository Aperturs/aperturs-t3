import { type NextApiRequest, type NextApiResponse } from "next";
import { json } from "stream/consumers";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const seomthing = req.body;
    const params = req.query;

    console.log(seomthing,"test")
    try{
    await prisma.test.create({
        data: {
           // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
           data: JSON.stringify(params)
        },
    })}catch(e){
        console.log(e)
    }
    res.status(200).json({ message: "OKAY" });
}
