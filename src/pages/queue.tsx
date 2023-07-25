import { type ReactElement } from "react";
import { Layout } from "~/components";
import { QueueNav } from "~/components/queue/queue";

function Queue() {
  return (
    <div className="flex justify-center">
      <QueueNav />
    </div>
  );
}

Queue.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Queue;
