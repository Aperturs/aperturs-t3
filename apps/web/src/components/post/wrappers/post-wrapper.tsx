import SideBar from "../sidebar/personal/sidebar";
import SidebarWrapper from "../sidebar/sidebar-wrapper";
import SocialTabs from "../tabs/socialtabs";

function PostView({ params }: { params: { id: string } }) {
  console.log("mounted PostView");
  return (
    <div className="flex  justify-center gap-5">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        <SidebarWrapper>
          <SideBar params={params} />
        </SidebarWrapper>
      </div>
    </div>
  );
}

export default PostView;
