import { Skeleton } from "@aperturs/ui/skeleton";

export default function OrgDetailsSkeleton() {
  return (
    <Skeleton className="my-1 h-full w-full">
      <div className="flex  gap-2 p-2">
        <Skeleton className="h-12 w-16 rounded-full" />
        <div className="w-[95%]">
          <Skeleton className="mb-1 h-6 w-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Skeleton>
  );
}
