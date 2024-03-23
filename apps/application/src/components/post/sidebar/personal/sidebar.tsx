"use client";

import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";
import { PostTypeSelect } from "../../common";
import ConnectedAccounts from "../filter-connection";
import Publish from "./publish";

const SideBar = ({ params }: { params: { postid: string } }) => {
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
          <>
            <ConnectedAccounts data={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default SideBar;
