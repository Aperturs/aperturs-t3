import React from "react";

import BgSvg from "./bg-svg";

export default function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-1">
      <div className="relative  flex w-full justify-center rounded-t-[40px] bg-white ">
        <div className="mt-1 w-full max-w-screen-2xl px-6 lg:px-8">
          {children}
        </div>
        <BgSvg />
      </div>
    </div>
  );
}
