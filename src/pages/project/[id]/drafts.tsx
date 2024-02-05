import { type ReactElement } from "react";
import LogoLoad from "~/components/custom/loading/logoLoad";
import DraftCard from "~/components/drafts/darfCard";
import Layout from "~/components/layouts/Layout";
import ProjectLayout from "~/components/layouts/projectnavbar/projectLayout";
import { type PostContentType } from "~/types/post-types";
import { api } from "~/utils/api";

const DraftPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data, isLoading, error, refetch } =
    api.savepost.getSavedPostsByProjectId.useQuery(id);

  if (isLoading) {
    return <LogoLoad size="24" />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between">
        <h2 className="mt-2 text-2xl font-bold">Drafts</h2>
        {/* <div className="flex gap-2">
          <button className="btn-primary btn gap-2 px-4 py-2 text-white">
            Add all to Queue
            <BsFillCalendarFill className="ml-2" />
          </button>
        </div> */}
      </div>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        {data?.map((post) => (
          <DraftCard
            key={post.id}
            id={post.id}
            content={
              (post.content as any as PostContentType[])[0]?.content || ""
            }
            refetch={refetch}
          />
        ))}
        {/* <DraftCard id={1} />
        <DraftCard id={2} />
        <DraftCard id={3} /> */}
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
