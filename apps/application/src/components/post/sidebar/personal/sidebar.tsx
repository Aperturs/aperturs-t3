"use client";

import { SocialType } from "@aperturs/validators/post";

import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";
import { PostTypeSelect } from "../../common";
import ConnectedAccount from "../connections";
import Publish from "./publish";

const SideBar = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = api.user.fetchConnectedAccounts.useQuery();
  console.log(data);

  return (
    <div>
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <PostTypeSelect />
        <h2 className="text-xl">Schedule Post</h2>
        <Publish params={params} />
        <span className="my-2 text-xl">Publish Post</span>
        {isLoading ? (
          <SimpleLoader />
        ) : (
          <div className="grid grid-cols-3 place-items-start gap-3">
            {data?.map((item) =>
              (item.type as SocialType) === SocialType.Youtube ? null : (
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
        )}
      </div>
    </div>
  );
};

export default SideBar;
