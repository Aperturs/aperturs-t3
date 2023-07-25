import { type ReactElement } from "react";
import { BsFillCalendarFill } from "react-icons/bs";
import {  DraftCard, Layout, ProjectLayout } from "~/components";

const DraftPage = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Draft</h2>
        <div className="flex gap-2">
          <button className="btn-primary btn gap-2 px-4 py-2 text-white">
            Add to Queue
            <BsFillCalendarFill className="ml-2" />
          </button>
        </div>
      </div>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        <DraftCard id={1} />
        <DraftCard id={2} />
        <DraftCard id={3} />
      </div>
    </div>
  );
};

DraftPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <ProjectLayout>{page}</ProjectLayout>
    </Layout>
  );
};

export default DraftPage;
