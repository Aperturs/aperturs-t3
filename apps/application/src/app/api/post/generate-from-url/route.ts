import { NextRequest } from "next/server";
import { serve } from "@upstash/qstash/nextjs";

export const POST = async (request: NextRequest) => {
  // do something with the native request object
  const handler = serve(async (context) => {
    // Your workflow steps
  });

  return await handler(request);
};
