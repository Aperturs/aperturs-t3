import Link from "next/link";
import { BsFillCalendarFill } from "react-icons/bs";
import { api } from "~/trpc/server";
import { type PostContentType } from "~/types/post-types";
import { Button } from "../ui/button";
import ToolTipSimple from "../ui/tooltip-final";
import PostCard from "./darfCard";

async function DraftPage() {
  const getSavedPosts = await api.savepost.getSavedPosts.query();

  return (
    <div className=" relative flex w-full flex-col">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Draft</h2>
        <div className="flex gap-2">
          {/* <CreateButton text="New Draft" /> */}
          <ToolTipSimple content="Comming Soon...">
            <Button className="dark:text-white">
              Add to Queue
              <BsFillCalendarFill className="ml-2" />
            </Button>
          </ToolTipSimple>
        </div>
      </div>
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
    </div>
  );
}

export default DraftPage;
