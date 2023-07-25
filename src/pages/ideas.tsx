import { type ReactElement } from "react";
import { Layout } from "~/components";

const IdeasPage = () => {
  return <div></div>;
};

IdeasPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IdeasPage;
