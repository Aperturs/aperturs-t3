/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostContentType } from "@aperturs/validators/post";

import { api } from "~/trpc/server";
import InfoContainer from "./container";

export default async function FetchDrafts({ orgid }: { orgid?: string }) {
  const recentDrafts = await api.savepost.getRecentDrafts({
    orgid: orgid,
  });

  return (
    <InfoContainer
      title="Recent Drafts"
      infoBlocks={
        recentDrafts?.map((draft) => ({
          title: `${
            (
              (draft.content as any as PostContentType[])[0]?.content as string
            )?.slice(0, 60) ?? ""
          }...`,
          // title: 'test',
          link: `post/${draft.id}`,
        })) || []
      }
      emptyInfo={{
        emptyText: "You have no drafts yet.",
        buttonText: "Create a draft",
        buttonLink: "/post",
      }}
    />
  );
}
