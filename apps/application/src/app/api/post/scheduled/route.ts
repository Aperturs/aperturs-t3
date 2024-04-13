import { NextRequest, NextResponse } from "next/server";

import { api } from "~/trpc/server";

const handler = async (req: NextRequest) => {
  const postid = req.nextUrl.searchParams.get("postid");
  console.log(postid);
  try {
    const plans = {
      postid: postid,
    };
    return NextResponse.json(plans);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
