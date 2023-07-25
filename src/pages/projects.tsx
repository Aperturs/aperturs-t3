import { type ReactElement } from "react";
import { GithubCard, Layout, NewRepoFormModal } from "~/components";

function Projects() {
  return (
    <div className="w-full py-12 ">
      <div className="mb-6 w-full justify-between md:flex">
        <h3 className="text-lg font-bold sm:text-xl lg:text-2xl ">
          Your Connected Repositories
        </h3>
        <NewRepoFormModal />
      </div>
      <div className={`grid-col-1  grid gap-6 sm:grid-cols-2 xl:grid-cols-4`}>
        <GithubCard
          projectId="test"
          repoName="test"
          repoDescription="test"
          lastUpdated="test"
        />
      </div>
    </div>
  );
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Projects;
