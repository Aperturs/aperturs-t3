import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import { Skeleton } from "@aperturs/ui/skeleton";

export default function LinkedInPreviewSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <Image
          width={48}
          height={48}
          className="mr-4 h-12 w-12 rounded-full"
          src="/profile.jpeg"
          alt={`luffy's avatar`}
        />
        <div>
          <h3 className="font-semibold text-gray-900">Luffy</h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-20">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="grid w-full grid-cols-2 gap-2 pt-0">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
