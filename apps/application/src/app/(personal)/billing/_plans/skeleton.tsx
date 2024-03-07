import { Skeleton } from "@aperturs/ui/skeleton";

export default function PlansSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </section>
  );
}
