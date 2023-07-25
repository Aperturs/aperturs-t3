import { BsFillCalendarFill } from "react-icons/bs";
import PostCard from "./darfCard";

const DraftPage = () => {
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
        <PostCard id={1} />
        <PostCard id={2} />
        <PostCard id={3} />
      </div>
    </div>
  );
};

export default DraftPage;
