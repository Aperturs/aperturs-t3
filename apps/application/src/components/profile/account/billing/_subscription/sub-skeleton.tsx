import { Skeleton } from "@aperturs/ui/skeleton";

export default function SubscriptionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
