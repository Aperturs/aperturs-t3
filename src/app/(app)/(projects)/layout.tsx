import React from "react";
import ProjectLayout from "~/components/layouts/projectnavbar/projectLayout";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return <ProjectLayout params={params}>{children}</ProjectLayout>;
}
