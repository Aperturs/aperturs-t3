"use client";

import { Button } from "@aperturs/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@aperturs/ui/sheet";

import useIsMobile from "~/hooks/useIsMobile";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile(1024);

  return (
    <>
      {!isMobile ? (
        <div className="shadow-blue-gray-900/5 z-20 w-full rounded-lg bg-card  p-4 px-8 shadow-xl  dark:border lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">
          {children}
        </div>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mt-[100px]">Advanced Settings</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Settings</SheetTitle>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
