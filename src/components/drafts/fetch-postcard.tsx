import PostCard from "./darfCard";
import Link from "next/link";
import { type PostContentType } from "~/types/post-types";
import { api } from "~/trpc/server";
import { Button } from "../ui/button";

export default async function FetchPostCard() {
  const getSavedPosts = await api.savepost.getSavedPosts.query();
  return (
    <>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        {getSavedPosts.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          getSavedPosts.map((item) => (
            <PostCard
              key={item.id}
              id={item.id}
              content={
                (item.content as any as PostContentType[])[0]?.content || ""
              }
            />
          ))
        ) : (
          <div className="absolute top-[40dvh] grid w-full place-content-center">
            <h1 className="mb-2 text-center text-xl font-semibold">
              No Drafts Available
            </h1>
            <Link href="/post">
              <Button>Create New Draft</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
