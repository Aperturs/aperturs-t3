import { api } from "~/trpc/server";
import InfoContainer from "./container";

export default async function FetchProjects() {
  const recentProjects = await api.github.project.getRecentProjects.query();
  return (
    <>
      <InfoContainer
        title="Your Recent Projects"
        infoBlocks={
          recentProjects?.map((project) => ({
            title: project.projectName || project.repoName,
            link: `/project/${project.id}/commits`,
          })) || []
        }
        emptyInfo={{
          emptyText: "You have no projects yet.",
          buttonText: "Add a project",
          buttonLink: "/projects",
        }}
      />
    </>
  );
}
