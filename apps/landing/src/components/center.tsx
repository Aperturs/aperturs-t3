import React from "react";

export default function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative  flex w-full justify-center ">
      <div className="mt-1 w-full max-w-screen-xl px-6 lg:px-8">{children}</div>
    </div>
  );
}
