// import { CreateButton } from "~/components";
import { currentUser } from "@clerk/nextjs";
import FetchDrafts from "./fetchdrafts";
import FetchProjects from "./fetchprojects";
import { Suspense } from "react";
import SkeletonLoad from "../custom/loading/skeleton-load";

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
        <Suspense fallback={<SkeletonLoad />}>
          <FetchDrafts />
          <FetchProjects />
        </Suspense>
      </div>
      {/* <CreateButton text="Create" /> */}
    </div>
  );
}

export default ContentPage;
