import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { api } from "~/trpc/server";

const handler = async (req: NextRequest) => {
  const postid = req.nextUrl.searchParams.get("postid");

  if (!postid) {
    return NextResponse.json({ error: "Post ID not found" }, { status: 400 });
  }
  console.log(postid, "post id");

  try {
    const postAll = await api.post.postByPostId({
      postId: postid,
    });

    console.log(postAll);

    return NextResponse.json(postAll, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
};

export { handler as GET, handler as POST };
