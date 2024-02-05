import React from "react";
import ProjectNavBar from "./projectnavbar";

function projectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  console.log(params, "params from projectLayout");
  return (
    <div className="px-3">
      <ProjectNavBar params={params} />
      <div className="my-3 ">{children}</div>
    </div>
  );
}

export default projectLayout;
