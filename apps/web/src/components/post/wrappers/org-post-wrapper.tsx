import React from "react";

import SocialTabs from "../tabs/socialtabs";

export default function OrgPostWrapper() {
  return (
    <div className="flex  justify-center gap-5">
      <SocialTabs />
      <div className="mt-[-6rem] w-full lg:max-w-[18rem]">
        {/* <SideBar params={params} /> */}
      </div>
    </div>
  );
}
