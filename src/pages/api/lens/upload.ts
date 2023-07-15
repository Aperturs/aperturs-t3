import Bundlr from "@bundlr-network/client"
import { NextApiRequest, NextApiResponse } from "next";

const TOP_UP = '100000000000000000'; // 0.2 MATIC
const MIN_FUNDS = 0.05;

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  console.log("trying")
  const data = JSON.parse(req.body)
  const bundlr = new Bundlr("http://node1.bundlr.network", "matic", process.env.BNDLR_KEY)
  await bundlr.ready()
  let balance = await bundlr.getLoadedBalance()
  let readableBalance = bundlr.utils.fromAtomic(balance).toNumber()

  if (readableBalance < MIN_FUNDS) {
    await bundlr.fund(TOP_UP);
  }

  const tx = await bundlr.upload(JSON.stringify(data), {
    tags: [{ name: 'Content-Type', value: 'application/json' }],
  })
  console.log(tx.id)
  res.status(200).json({ url: `https://arweave.net/${tx.id}` })
}
