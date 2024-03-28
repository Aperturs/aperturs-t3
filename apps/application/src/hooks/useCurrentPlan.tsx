import { useUser } from "@clerk/nextjs";

import type { PublicMetaData } from "@aperturs/validators/private_metadata";

export default function useCurrentPlan() {
  const { user } = useUser();

  console.log(user, "user");

  if (!user) {
    return { currentPlan: "FREE" };
  }

  const publicMeta = user.publicMetadata as PublicMetaData;
  const plan = publicMeta.currentPlan;

  return { currentPlan: plan };
}
