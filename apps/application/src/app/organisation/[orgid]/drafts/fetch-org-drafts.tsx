/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

import type { PostContentType } from "@aperturs/validators/post";
import { Button } from "@aperturs/ui/button";

import DraftCard from "~/components/drafts/darfCard";
import { api } from "~/trpc/server";

export default async function FetchOrgDrafts({
  params,
}: {
  params: { orgid: string };
}) {
  const getSavedPosts = await api.savepost.getSavedPosts({
    orgid: params.orgid,
  });

  return (
    <>
      {getSavedPosts.length > 0 ? (
        getSavedPosts.map((item) => (
          <DraftCard
            key={item.id}
            id={item.id}
            content={
              (item.content as any as PostContentType[])[0]?.content ??
              item.youtubeContent.description ??
              ""
            }
            contentT={item.content as any as PostContentType[]}
          />
        ))
      ) : (
        <div className="absolute top-[40dvh] grid w-full place-content-center">
          <h1 className="mb-2 text-center text-xl font-semibold">
            No Drafts Available
          </h1>
          <Link href={`/organisation/${params.orgid}/post/`} className="ml-4">
            <Button>Create New Draft</Button>
          </Link>
        </div>
      )}
    </>
  );
}
