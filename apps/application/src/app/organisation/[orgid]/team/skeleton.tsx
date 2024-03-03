import React from "react";

import { Skeleton } from "@aperturs/ui/skeleton";

export default function TeamPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
