// import { CreateButton } from "~/components";

import { useUser } from "@clerk/nextjs";
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

  return `Good ${timeOfDay}`
}

const ContentPage = () => {
  const {user} = useUser();



  return (
    <div className="flex flex-col w-full justify-start gap-7">
    <div className="flex flex-col gap-1 justify-items-start px-5">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-left">
        {user?.firstName ? `${WishingGoodDay()}, ${user.firstName} 😀` : `${WishingGoodDay()}`}
      </h2>
      <p className="text-sm md:text-base lg:text-lg text-left">
        Welcome to your dashboard. Quickly access your most important
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4 mt-10">
      <InfoContainer title="Your Tasks" />
      <InfoContainer title="Your Tasks" />
    </div>

    {/* <CreateButton text="Create" /> */}
  </div>
  
  );
};

export default ContentPage;
