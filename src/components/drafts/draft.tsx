"use client";

import Link from "next/link";
import { BsFillCalendarFill } from "react-icons/bs";
import { type PostContentType } from "~/types/post-types";
import LogoLoad from "../custom/loading/logoLoad";
import PostCard from "./darfCard";
import { api } from "~/trpc/react";
import { Tooltip } from "@material-tailwind/react";

const DraftPage = () => {
  // const {data, isLoading, error, refetch} = api.savepost.getSavedPosts.useQuery();

  // if (isLoading) return <LogoLoad size="100" />;
  // if (error) return <div>Something Went Wrong</div>;

  // console.log(data, "data");

  return (
    <div className=" relative flex w-full flex-col">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Draft</h2>
        <div className="flex gap-2">
          {/* <CreateButton text="New Draft" /> */}
          <Tooltip
            content="Comming Soon..."
            className="bg-secondary text-black"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <button className="btn btn-primary gap-2 px-4 py-2 text-white">
              Add to Queue
              <BsFillCalendarFill className="ml-2" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        {/* {data.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          data.map((item) => (
            <PostCard
              key={item.id}
              id={item.id}
              content={
                (item.content as any as PostContentType[])[0]?.content || ""
              }
              refetch={refetch}
            />
          ))
        ) : (
          <div className="absolute top-[40dvh] grid w-full place-content-center">
            <h1 className="mb-2 text-center text-xl font-semibold">
              No Drafts Available
            </h1>
            <Link href="/post" className="btn">
              Create New Draft
            </Link>
          </div>
        )} */}

        <PostCard
          id="1"
          content="This is a test content"
          refetch={() => console.log("refetch")}
          // refetch={refetch}
        />
      </div>
    </div>
  );
};

export default DraftPage;
