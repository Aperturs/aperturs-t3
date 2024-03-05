import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

const handler = async () => {
  try {
    const plans = await api.subscription.fetchPlans();
    return NextResponse.json(plans);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
};

export { handler as GET, handler as POST };
