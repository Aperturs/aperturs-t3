import { Suspense } from "react";

import MembersTable from "./fetcher";
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
      <MembersTable params={params} />
    </Suspense>
  );
}
