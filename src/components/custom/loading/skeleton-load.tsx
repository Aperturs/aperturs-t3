/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonLoad() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
      {[...Array(2)].map((_, index) => (
        <SkeletonCard key={index * 2} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className='w-[150px]" h-4 ' />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="my-2 h-4 w-[450px]" />
        <Skeleton className="h-4 w-[450px]" />
      </CardContent>
    </Card>
  );
}
