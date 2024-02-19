import OrgSideBar from "../sidebar/organisation/sidebar";
import SidebarWrapper from "../sidebar/sidebar-wrapper";
import SocialTabs from "../tabs/socialtabs";

export default function OrgPostWrapper() {
  return (
    <div className="flex  flex-col gap-5 lg:flex-row lg:justify-center">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        {/* <SideBar params={params} /> */}
        <SidebarWrapper>
          <OrgSideBar />
        </SidebarWrapper>
      </div>
    </div>
  );
}
