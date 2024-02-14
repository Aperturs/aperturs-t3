import { api } from "~/trpc/server";
import { type PostContentType } from "~/types/post-types";
import InfoContainer from "./container";

export default async function FetchDrafts() {
  const recentDrafts = await api.savepost.getRecentDrafts.query();
  return (
    <>
      <InfoContainer
        title="Recent Drafts"
        infoBlocks={
          recentDrafts?.map((draft) => ({
            title: `${
              (draft.content as any as PostContentType[])[0]?.content?.slice(
                0,
                60
              ) || ""
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
    </>
  );
}
