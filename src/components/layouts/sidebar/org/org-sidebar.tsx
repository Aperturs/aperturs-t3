"use client";

import {
  Bars2Icon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BsFillClipboardDataFill } from "react-icons/bs";
import { MdCircleNotifications, MdSpaceDashboard } from "react-icons/md";
import { TbSocial } from "react-icons/tb";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ModeToggle } from "../../theme-toggle";
import BottomMenu from "../bottomMenu";
import AccordanceMenu from "../command-group";
import { CommandMenu } from "../command-menu";
import ProfileButton from "../profile-button";

function AccordanceMenuList(id: string) {
  return [
    {
      open: 1,
      text: "Dashboard",
      icon: <MdSpaceDashboard className="h-5 w-5" />,
      items: [
        {
          subText: "Home",
          subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
          url: `/organisation/${id}/dashboard`,
        },
        {
          subText: "New Post",
          subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
          url: `/organisation/${id}/post`,
        },
        {
          subText: "Queue",
          subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
          url: `/organisation/${id}/queue`,
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
          url: `/organisation/${id}/drafts`,
        },
        {
          subText: "Ideas",
          subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
          url: `/organisation/${id}/ideas`,
        },
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
}

function bottomMenuList(id: string) {
  return [
    {
      text: "Notifications",
      icon: <MdCircleNotifications className="h-5 w-5" />,
      suffix: <Badge>14</Badge>,
      url: `/organisation/${id}/notifications`,
    },
    {
      text: "Team",
      icon: <UserCircleIcon className="h-5 w-5" />,
      url: `/organisation/${id}/team`,
    },
    {
      text: "Socials",
      icon: <TbSocial className="h-5 w-5" />,
      url: `/organisation/${id}/socials`,
    },
  ];
}

export default function OrgSidebar() {
  const params = useParams<{ orgid: string }>();
  const orgId = params?.orgid;

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
            <CommandMenu accordanceMenuList={AccordanceMenuList(orgId || "")} />
            <ModeToggle />
            <SheetTrigger asChild>
              <Button
                size="icon"
                // onClick={toggleIsNavOpen}
                className="p-0 lg:hidden"
              >
                <Bars2Icon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </div>
        </div>
        <div className="hidden flex-1 flex-col justify-between lg:flex">
          <>
            <AccordanceMenu
              accordanceMenuList={AccordanceMenuList(orgId || "")}
            />
            <hr className="border-blue-gray-50 my-2" />
            <BottomMenu bottomMenu={bottomMenuList(orgId || "")} />
          </>
          <div className="flex w-full justify-center">
            <ProfileButton />
          </div>
        </div>
        {/* <AnimatePresence>
          {isNavOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-scroll"
            >
              <div>
                <AccordianMenu accordanceMenuList={AccordanceMenuList(orgId || "")} />
                <hr className="border-blue-gray-50 my-2" />
                <BottomMenu />
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}
        <SheetContent
          className={clsx(
            "fixed top-0 w-[100vw] border-r-[1px] bg-background/80 p-6 backdrop-blur-xl xs:w-[440px]"
          )}
        >
          <div>
            <AccordanceMenu
              accordanceMenuList={AccordanceMenuList(orgId || "")}
            />
            <hr className="border-blue-gray-50 my-2" />
            <BottomMenu bottomMenu={bottomMenuList(orgId || "")} />
          </div>
        </SheetContent>
        {/* <UpgradeAlert /> */}
      </Card>
    </Sheet>
  );
}
