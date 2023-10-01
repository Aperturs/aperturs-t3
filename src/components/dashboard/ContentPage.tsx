// import { CreateButton } from "~/components";

import { useUser } from "@clerk/nextjs";

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
    <div className="flex w-full justify-between">
    <div className="flex flex-col gap-1 justify-items-start px-5">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-left">
        {user?.firstName ? `${WishingGoodDay()}, ${user.firstName} 😀` : `${WishingGoodDay()}`}
      </h2>
      <p className="text-sm md:text-base lg:text-lg text-left">
        Welcome to your dashboard. Quickly access your most important
      </p>
    </div>
    {/* <CreateButton text="Create" /> */}
  </div>
  
  );
};

export default ContentPage;
