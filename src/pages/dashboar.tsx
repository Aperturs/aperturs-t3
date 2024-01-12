import { type ReactElement } from "react";
import { ContentPage, Layout } from "~/components";

const Dashboard = () => {
  return <ContentPage />;
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
