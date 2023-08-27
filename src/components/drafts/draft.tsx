import { BsFillCalendarFill } from "react-icons/bs";
import { api } from "~/utils/api";
import PostCard from "./darfCard";

const DraftPage = () => {
  const { data } = api.userPost.getSavedPosts.useQuery();

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Draft</h2>
        <div className="flex gap-2">
          {/* <CreateButton text="New Draft" /> */}
          <button className="btn-primary btn gap-2 px-4 py-2 text-white">
            Add to Queue
            <BsFillCalendarFill className="ml-2" />
          </button>
        </div>
      </div>
      <div
        className="grid-col-1 mt-4 grid gap-6 sm:grid-cols-2
        xl:grid-cols-3
        "
      >
        {data
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          ? data.map((item) => <PostCard key={item.id} id={item.id} content={item.defaultContent} />)
          : null}
        {/* <PostCard id="1" />
        <PostCard id="2" />
        <PostCard id="3" /> */}
      </div>
    </div>
  );
};

export default DraftPage;
