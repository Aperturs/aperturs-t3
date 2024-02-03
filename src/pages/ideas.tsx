import { type ReactElement } from "react";
import Layout from "~/components/layouts/Layout";

const IdeasPage = () => {
  return (
    <div className="grid h-full w-full place-content-center">
      <h1>Comming Soon...</h1>
    </div>
  );
};

IdeasPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IdeasPage;
