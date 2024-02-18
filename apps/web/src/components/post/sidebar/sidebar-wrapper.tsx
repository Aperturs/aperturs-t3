"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@aperturs/ui/drawer";

import useIsMobile from "~/hooks/useIsMobile";

export default function SidebarWrapper({
  children,
  mobileChildren,
}: {
  children: React.ReactNode;
  mobileChildren?: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile ? (
        <div className="shadow-blue-gray-900/5 z-20 w-full rounded-lg bg-card  p-4 px-8 shadow-xl  dark:border lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">
          {children}
        </div>
      ) : (
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Advanced Settings</DrawerTitle>
              {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
            </DrawerHeader>
            {mobileChildren}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
