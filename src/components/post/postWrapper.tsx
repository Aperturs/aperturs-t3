import SideBar from "./sidebar/sidebar";
import SocialTabs from "./tabs/socialtabs";

function PostView() {

  return (
    <div className="flex  justify-center gap-5">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        <SideBar />
      </div>
    </div>
  );
}

export default PostView;
