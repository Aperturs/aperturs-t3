import { type ReactElement } from "react";
import { DraftPage, Layout } from "~/components";

const DraftPost = () => {
  return (
    <div className="relative flex">
      <DraftPage />
    </div>
  );
};

DraftPost.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DraftPost;
