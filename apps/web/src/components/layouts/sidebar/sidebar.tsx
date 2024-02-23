"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bars2Icon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { BsFileCodeFill, BsFillClipboardDataFill } from "react-icons/bs";
import { MdCircleNotifications, MdSpaceDashboard } from "react-icons/md";
import { TbSocial } from "react-icons/tb";

import { Badge } from "@aperturs/ui/badge";
import { Button } from "@aperturs/ui/button";
import { Card } from "@aperturs/ui/card";
import { cn } from "@aperturs/ui/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@aperturs/ui/sheet";

import { api } from "~/trpc/react";
import { getUserPrivateMetadata } from "~/utils/actions/user-private-meta";
import { ModeToggle } from "../theme-toggle";
import BottomMenu from "./bottomMenu";
import AccordianMenu from "./command-group";
import { CommandMenu } from "./command-menu";
import ProfileButton from "./org/profile-button";

const AccordanceMenuList = [
  {
    open: 1,
    text: "Dashboard",
    icon: <MdSpaceDashboard className="h-5 w-5" />,
    items: [
      {
        subText: "Home",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/dashboard",
      },
      {
        subText: "New Post",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/post",
      },
      {
        subText: "Queue",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/queue",
      },
    ],
  },
  {
    open: 2,
    text: "Content",
    icon: <BsFillClipboardDataFill className="h-5 w-5" />,
    items: [
      {
        subText: "Drafts",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/drafts",
      },
      {
        subText: "Ideas",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/ideas",
      },
    ],
  },

  {
    open: 3,
    text: "Projects",
    icon: <BsFileCodeFill className="h-5 w-5" />,
    items: [
      {
        subText: "Connected Projects",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/project",
      },
    ],
  },
];

const bottomMenu = [
  {
    text: "Notifications",
    icon: <MdCircleNotifications className="h-5 w-5" />,
    suffix: <Badge>14</Badge>,
    url: "/notifications",
  },
  {
    text: "Profile",
    icon: <UserCircleIcon className="h-5 w-5" />,
    url: "/profile",
  },
  {
    text: "Socials",
    icon: <TbSocial className="h-5 w-5" />,
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

  // const { data: metadata,error } = useQuery({
  //   queryKey: ["userPrivateMetadata"],
  //   queryFn: () => getUserPrivateMetadata(),
  //   // refetchInterval:1000,
  // });

  const { data: metadata } = api.metadata.getUserPrivateMetaData.useQuery();

  // console.log(metadata,error,'meta');

  return (
    <Sheet>
      <Card className="mt-2 flex w-full flex-col overflow-scroll p-4 shadow-md lg:fixed lg:left-4  lg:h-[calc(100vh-2rem)] lg:max-w-[18rem]">
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
            <p className="text-sm text-muted-foreground">
              {/* Press{" "} */}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </p>
            <CommandMenu accordanceMenuList={AccordanceMenuList} />
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
            <hr className="border-blue-gray-50 my-2" />
            <BottomMenu bottomMenu={bottomMenu} />
          </>
          {metadata && metadata.currentPlan !== "FREE" && (
            <div className="flex w-full justify-center">
              <ProfileButton />
            </div>
          )}
        </div>
        <SheetContent
          className={cn(
            "fixed top-0 w-[100vw] border-r-[1px] bg-background/80 p-6 backdrop-blur-xl xs:w-[440px]",
          )}
        >
          <div>
            {metadata?.currentPlan !== "FREE" && (
              <div className="flex w-full justify-center">
                <ProfileButton />
              </div>
            )}
            <AccordianMenu accordanceMenuList={AccordanceMenuList} />
            <hr className="border-blue-gray-50 my-2" />
            <BottomMenu bottomMenu={bottomMenu} />
          </div>
        </SheetContent>
        {/* <UpgradeAlert /> */}
      </Card>
    </Sheet>
  );
}
