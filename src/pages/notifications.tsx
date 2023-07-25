import { type ReactElement } from "react";
import { Layout } from "~/components";

function Notifications() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      you have no notifications
    </div>
  );
}

Notifications.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Notifications;
