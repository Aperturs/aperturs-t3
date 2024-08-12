import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { api } from "~/trpc/server";

const handler = async (request: NextRequest) => {
  const postid = request.nextUrl.searchParams.get("postid");
  const videoId = request.nextUrl.searchParams.get("videoUrl");

  if (!postid || !videoId) {
    return NextResponse.error();
  }

  console.log(postid, videoId);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // const email = await api.youtube.sendSuccessEmail({
    //   postid,
    //   youtubeurl: videoUrl,
    // });
    return NextResponse.json(email);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
