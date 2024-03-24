import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import { Skeleton } from "@aperturs/ui/skeleton";

export default function DraftSkeleton() {
  return (
    <Card>
      <CardHeader className="">
        <p>Draft</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pb-20">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="grid w-full grid-cols-4 gap-2 pt-0">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
