"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bars2Icon } from "@heroicons/react/24/outline";
import { BsFillClipboardDataFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";

import { Button } from "@aperturs/ui/button";
import { Card } from "@aperturs/ui/card";
import {
  Draft,
  Home,
  Network,
  Payment,
  Pencil,
  Person,
  PluraCategory,
} from "@aperturs/ui/icons";
import { cn } from "@aperturs/ui/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@aperturs/ui/sheet";

import { ModeToggle } from "../theme-toggle";
import BottomMenu from "./bottomMenu";
import ProfileButton from "./org/profile-button";
import { default as AccordianMenu } from "./sidebar-menu";

const AccordanceMenuList = [
  {
    open: 1,
    text: "Dashboard",
    icon: <MdSpaceDashboard className="h-5 w-5" />,
    items: [
      {
        subText: "Home",
        subIcon: <Home />,
        url: "/dashboard",
      },
      // {
      //   subText: "Queue",
      //   subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      //   url: "/queue",
      // },
    ],
  },
  {
    open: 2,
    text: "Content",
    icon: <BsFillClipboardDataFill className="h-5 w-5" />,
    items: [
      {
        subText: "New Post",
        subIcon: <Pencil />,
        url: "/post",
      },
      {
        subText: "Published",
        subIcon: <Draft />,
        url: "/published",
      },
      {
        subText: "Drafts",
        subIcon: <Draft />,
        url: "/drafts",
      },
      // {
      //   subText: "Ideas",
      //   subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
      //   url: "/ideas",
      // },
    ],
  },

  // {
  //   open: 3,
  //   text: "Projects",
  //   icon: <BsFileCodeFill className="h-5 w-5" />,
  //   items: [
  //     {
  //       subText: "Connected Projects",
  //       subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
  //       url: "/project",
  //     },
  //   ],
  // },
];

const bottomMenu = [
  // {
  //   text: "Notifications",
  //   icon: <Notification />,
  //   // suffix: <Badge>14</Badge>,
  //   url: "/notifications",
  // },
  {
    text: "Details",
    icon: <PluraCategory />,
    url: "/details",
  },
  {
    text: "Profile",
    icon: <Person />,
    url: "/profile",
  },
  {
    text: "Billing",
    icon: <Payment />,
    url: "/billing",
  },
  {
    text: "Socials",
    icon: <Network />,
    url: "/socials",
  },
];

export default function SideBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 768 && setIsNavOpen(false),
    );
  }, []);

  const pathName = usePathname();

  useEffect(() => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <Sheet>
      <Card className="mt-2 flex w-full flex-col overflow-scroll p-4 shadow-md md:h-[calc(100vh-2rem)] lg:fixed  lg:left-4 lg:max-w-[18rem]">
        <div className="mb-2 flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.svg"
              alt="brand"
              className="h-8 w-8 dark:brightness-0 dark:invert"
              width={8}
              height={8}
            />
            <h5>Aperturs</h5>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SheetTrigger asChild>
              <Button
                size="icon"
                onClick={toggleIsNavOpen}
                className="p-0 lg:hidden"
              >
                <Bars2Icon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </div>
        </div>
        <div className="hidden flex-1 flex-col justify-between lg:flex">
          <>
            <AccordianMenu accordanceMenuList={AccordanceMenuList} />
            <hr className="my-2 border-zinc-400" />
            <BottomMenu bottomMenu={bottomMenu} />
          </>

          {/* <div className="flex w-full justify-center">
            <ProfileButton />
          </div> */}
        </div>

        {/* <UpgradeAlert /> */}
      </Card>
      <SheetContent
        className={cn(
          "fixed top-0 w-[100vw] border-r-[1px] bg-background/80 p-6 backdrop-blur-xl xs:w-[440px]",
        )}
      >
        <div>
          {/* {metadata?.currentPlan !== "FREE" && ( */}
          <div className="flex w-full justify-center">
            <ProfileButton />
          </div>
          {/* )} */}
          <AccordianMenu accordanceMenuList={AccordanceMenuList} />
          <hr className="border-blue-gray-50 my-2" />
          <BottomMenu bottomMenu={bottomMenu} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
