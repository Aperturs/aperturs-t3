// import { CreateButton } from "~/components";

import { useUser } from "@clerk/nextjs";
import InfoContainer from "./container";
import { api } from "~/utils/api";

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

const ContentPage = () => {
  const { user } = useUser();
  const {data:recentDrafts} = api.savepost.getRecentDrafts.useQuery();

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
      <div className="mt-10 grid grid-cols-2 gap-4">
        <InfoContainer
          title="Recent Drafts"
          infoBlocks={recentDrafts?.map((draft) => ({
            title: `${draft.defaultContent.slice(0, 60)|| ''}...`,
            // title: 'test',
            link: `post/${draft.id}`,
          })) || []}
        />
        <InfoContainer
          title="Your Tasks"
          infoBlocks={[]}
          emptyInfo={{
            emptyText: "You have no tasks yet.",
            buttonText: "Create a task",
            buttonLink: "/dashboard/create-task",
          }}
        />
      </div>

      {/* <CreateButton text="Create" /> */}
    </div>
  );
};

export default ContentPage;
