import { type ReactElement } from "react";
import { DraftPage, Layout } from "~/components";
import { ModalProvider } from "~/components/custom/modals/modalContext";

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
