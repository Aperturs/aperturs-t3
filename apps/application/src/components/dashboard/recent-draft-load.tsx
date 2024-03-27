import { Card, CardContent, CardHeader } from "@aperturs/ui/card";
import { Skeleton } from "@aperturs/ui/skeleton";

export default function RecentDraftLoading() {
  return (
    <Card>
      <CardHeader color="gray" className="mb-4 grid h-16 place-items-center">
        Recent Drafts
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}
