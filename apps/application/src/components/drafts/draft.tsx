import { Suspense } from "react";
import { BsFillCalendarFill } from "react-icons/bs";

import { Button } from "@aperturs/ui/button";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

import DraftSkeleton from "./draft-skeleton";

async function DraftPage({ children }: { children: React.ReactNode }) {
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
        <Suspense
          fallback={
            <>
              <DraftSkeleton />
              <DraftSkeleton />
              <DraftSkeleton />
            </>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}

export default DraftPage;
