import SideBar from "./sidebar/sidebar";
import SocialTabs from "./tabs/socialtabs";

function PostView({ params }: { params: { id: string } }) {
  console.log("mounted PostView");
  return (
    <div className="flex  justify-center gap-5">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        <SideBar params={params} />
      </div>
    </div>
  );
}

export default PostView;
