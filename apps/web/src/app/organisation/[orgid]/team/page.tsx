import { Suspense } from "react";

import MebersTable from "./fetcher";
import TeamPageSkeleton from "./skeleton";

export default function TeamPage({
  params,
}: {
  params: {
    orgid: string;
  };
}) {
  return (
    <Suspense fallback={<TeamPageSkeleton />}>
      <MebersTable params={params} />
    </Suspense>
  );
}
