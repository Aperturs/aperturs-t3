"use client";

import { SideBar } from ".";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <div className="relative gap-8 lg:flex">
        <div className="w-full lg:max-w-[18rem]">
          <SideBar />
        </div>
        <div className="relative mt-8 flex w-full justify-center px-2 lg:block  lg:p-12">
          {children}
        </div>
      </div>
    </section>
  );
}
