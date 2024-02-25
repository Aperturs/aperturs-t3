import { Suspense } from "react";

import { Card } from "@aperturs/ui/components/ui/card";

import { AddSocial } from "./personal/personal-social-connect";
import SocialsSkeleton from "./socials-skeleton";

export default function ConnectSocials({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="min-h-[50vh] w-full rounded-xl p-6">
      {/* <h1 className='text-5xl font-medium text-gray-600'>Connect Socials</h1> */}
      <div className="mt-4 flex flex-col">
        <h2 className="mb-6 text-xl font-bold md:text-3xl">
          Connect your socials
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
          <Suspense fallback={<SocialsSkeleton />}>{children}</Suspense>
          <AddSocial />
        </div>
      </div>
    </Card>
  );
}
