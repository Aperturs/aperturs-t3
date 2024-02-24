import Link from "next/link";

import NewRepoFormModal from "~/components/projects/newRepoModal";
import GithubCard from "~/components/projects/projectCard";
import { api } from "~/trpc/server";

async function Projects() {
  //TODO: moving them into separate components and add suspense and skeleton loading
  const data = await api.github.project.getAllProjects();
  const githubTokens = await api.user.getGithubAccounts();

  //   if (isLoading || tokensLoading) return <LogoLoad size="24" />;
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
      <div
        className={`grid-col-1 grid w-full gap-6  md:grid-cols-2 2xl:grid-cols-3`}
      >
        <GithubCard
          projectId="test"
          repoName="test"
          repoDescription="test"
          lastUpdated="test"
        />
        {data ? (
          data.map((item) => (
            <GithubCard
              key={item.id}
              projectId={item.id}
              repoName={item.repoName}
              repoDescription={item.repoDescription}
              lastUpdated={item.updatedAt.toDateString()}
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

export default Projects;
