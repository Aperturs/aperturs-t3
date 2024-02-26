import React from "react";

import { Skeleton } from "@aperturs/ui/components/ui/skeleton";

export default function SocialsSkeleton() {
  return (
    <>
      <Skeleton className="h-20 w-full rounded-md" />
      <Skeleton className="h-20 w-full rounded-md" />
      <Skeleton className="h-20 w-full rounded-md" />
    </>
  );
}
