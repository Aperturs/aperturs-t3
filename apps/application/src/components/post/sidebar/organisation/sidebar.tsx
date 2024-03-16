"use client";

import { useParams } from "next/navigation";

import { SocialType } from "@aperturs/validators/post";

import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";
import ConnectedAccount from "../connections";
import OrgPublish from "./publish";

export default function OrgSideBar() {
  const params = useParams<{ orgid: string; postId: string }>();
  const { data, isLoading } = api.organisation.socials.getAllSocials.useQuery({
    orgId: params.orgid,
  });

  return (
    <>
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <h2 className="text-xl">Schedule Post</h2>
        <OrgPublish params={params} />
        <span className="my-2 text-xl">Publish Post</span>
        {isLoading ? (
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
        )}
      </div>
    </>
  );
}
