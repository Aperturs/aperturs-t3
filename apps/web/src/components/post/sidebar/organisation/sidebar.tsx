"use client";

import { useParams } from "next/navigation";

import { api } from "~/trpc/react";

export default function OrgSideBar() {
  const params = useParams<{ orgid: string }>();
  const { data, isLoading } = api.user.fetchConnectedAccounts.useQuery();

  return (
    <div className="shadow-blue-gray-900/5 z-20 w-full rounded-lg bg-card  p-4 px-8 shadow-xl  dark:border lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <h2 className="text-xl">Schedule Post</h2>
        {/* <Publish params={params} /> */}
        <span className="my-2 text-xl">Publish Post</span>
        {/* {isLoading ? (
          <SimpleLoader />
        ) : (
          <div className="grid grid-cols-3 place-items-start gap-3">
            {data?.map((item) =>
              item.type === SocialType.Github ? null : (
                <ConnectedAccount
                  key={item.data.tokenId}
                  name={item.data.name ?? ""}
                  type={item.type}
                  profilePic={item.data.profile_image_url ?? "/user.png"}
                  id={item.data.tokenId}
                />
              ),
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
