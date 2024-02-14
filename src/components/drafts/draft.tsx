import { BsFillCalendarFill } from "react-icons/bs";

import { Button } from "../ui/button";
import ToolTipSimple from "../ui/tooltip-final";
import FetchPostCard from "./fetch-postcard";
import { Suspense } from "react";
import SkeletonLoad from "../custom/loading/skeleton-load";

function DraftPage() {
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
      <Suspense fallback={<SkeletonLoad />}>
        <FetchPostCard />
      </Suspense>
    </div>
  );
}

export default DraftPage;
