/* eslint-disable @typescript-eslint/no-explicit-any */
import DraftCard from "~/components/drafts/darfCard";
import { api } from "~/trpc/server";
import { type PostContentType } from "~/types/post-types";

async function DraftPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await api.savepost.getSavedPostsByProjectId.query(id);

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-start">
        <h2 className="mt-2 text-2xl font-bold">Drafts</h2>
      </div>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        {data.length > 0 ? (
          data?.map((post) => (
            <DraftCard
              key={post.id}
              id={post.id}
              content={
                (post.content as any as PostContentType[])[0]?.content || ""
              }
            />
          ))
        ) : (
          <div className="grid h-full w-full place-content-center">
            No Drafts
          </div>
        )}
        {/* <DraftCard id={1} />
        <DraftCard id={2} />
        <DraftCard id={3} /> */}
      </div>
    </div>
  );
}

export default DraftPage;
