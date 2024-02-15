/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CreateButton } from "~/components";
import { currentUser } from "@clerk/nextjs";

import type { PostContentType } from "~/types/post-types";
import { api } from "~/trpc/server";
import InfoContainer from "./container";

const WishingGoodDay = () => {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDay;

  if (hours < 12) {
    timeOfDay = "morning";
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }

  return `Good ${timeOfDay}`;
};

async function ContentPage() {
  const user = await currentUser();
  const recentDrafts = await api.savepost.getRecentDrafts.query();
  const recentProjects = await api.github.project.getRecentProjects.query();

  return (
    <div className="flex w-full flex-col justify-start gap-7">
      <div className="flex flex-col justify-items-start gap-1 px-5">
        <h2 className="text-left text-2xl font-bold md:text-3xl lg:text-4xl">
          {user?.firstName
            ? `${WishingGoodDay()}, ${user.firstName} 😀`
            : `${WishingGoodDay()}`}
        </h2>
        <p className="text-left text-sm md:text-base lg:text-lg">
          Welcome to your dashboard. Quickly access your most important
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoContainer
          title="Recent Drafts"
          infoBlocks={
            recentDrafts?.map((draft) => ({
              title: `${
                (draft.content as any as PostContentType[])[0]?.content?.slice(
                  0,
                  60,
                ) ?? ""
              }...`,
              // title: 'test',
              link: `post/${draft.id}`,
            })) || []
          }
          emptyInfo={{
            emptyText: "You have no drafts yet.",
            buttonText: "Create a draft",
            buttonLink: "/post",
          }}
        />
        <InfoContainer
          title="Your Recent Projects"
          infoBlocks={
            recentProjects?.map((project) => ({
              title: project.projectName ?? project.repoName,
              link: `/project/${project.id}/commits`,
            })) || []
          }
          emptyInfo={{
            emptyText: "You have no projects yet.",
            buttonText: "Add a project",
            buttonLink: "/projects",
          }}
        />
      </div>

      {/* <CreateButton text="Create" /> */}
    </div>
  );
}

export default ContentPage;
