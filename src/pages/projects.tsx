import Link from "next/link";
import { type ReactElement } from "react";
import { GithubCard, Layout, NewRepoFormModal } from "~/components";
import LogoLoad from "~/components/custom/loading/logoLoad";
import { api } from "~/utils/api";

function Projects() {
  const { data, isLoading } = api.github.project.getAllProjects.useQuery();
  const { data: githubTokens, isLoading: tokensLoading } =
    api.user.getGithubAccounts.useQuery();

  if (isLoading || tokensLoading) return <LogoLoad size="24" />;
  if (!githubTokens || githubTokens.length <= 0)
    return (
      <div className="flex h-screen items-center justify-center">
        Go to settings and add github
        <Link href="/settings" className="btn">
          Settings
        </Link>
      </div>
    );
  return (
    <div className="w-full py-12 ">
      <div className="mb-6 w-full justify-between md:flex">
        <h3 className="text-lg font-bold sm:text-xl lg:text-2xl ">
          Your Connected Repositories
        </h3>
        <NewRepoFormModal />
      </div>
      <div className={`grid-col-1  grid gap-6  xl:grid-cols-2 2xl:grid-cols-3`}>
        {/* <GithubCard
          projectId="test"
          repoName="test"
          repoDescription="test"
          lastUpdated="test"
        /> */}
        {data ? (
          data.map((item) => (
            <GithubCard
              key={item.id}
              projectId={item.id}
              repoName={item.repoName}
              repoDescription={item.repoDescription}
              lastUpdated=""
            />
          ))
        ) : (
          <div className="grid h-full w-full place-content-center">
            No Projects Connected
          </div>
        )}
      </div>
    </div>
  );
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Projects;
