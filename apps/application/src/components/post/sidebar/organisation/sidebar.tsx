"use client";

import { useParams } from "next/navigation";

import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";
import { PostTypeSelect } from "../../common";
import ConnectedAccounts from "../filter-connection";
import OrgPublish from "./publish";

export default function OrgSideBar() {
  const params = useParams<{ orgid: string; postid: string }>();
  const { data, isLoading } = api.organisation.socials.getAllSocials.useQuery({
    orgId: params.orgid,
  });

  console.log(data, "data");

  return (
    <>
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <PostTypeSelect />
        <h2 className="text-xl">Schedule Post</h2>
        <OrgPublish params={params} />
        <span className="my-2 text-xl">Publish Post</span>
        {isLoading ? (
          <SimpleLoader />
        ) : (
          <>
            <ConnectedAccounts data={data} />
          </>
        )}
      </div>
    </>
  );
}
