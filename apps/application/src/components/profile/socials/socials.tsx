import { Suspense } from "react";

import { Card } from "@aperturs/ui/card";

import orgDetailsAction from "~/hooks/org-details-action";
import { AddSocial } from "./add-socials";
import SocialsSkeleton from "./socials-skeleton";

export default async function ConnectSocials({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await orgDetailsAction();

  return (
    <Card className="min-h-[50vh] w-full rounded-xl p-6">
      <div className="mt-4 flex flex-col">
        <h2 className="mb-6 text-xl font-bold md:text-3xl">
          Connect your Socials
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <Suspense fallback={<SocialsSkeleton />}>{children}</Suspense>
          {isAdmin && <AddSocial />}
        </div>
      </div>
    </Card>
  );
}
