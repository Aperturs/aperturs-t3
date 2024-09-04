"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { BsFillClipboardDataFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";

import {
  Draft,
  Home,
  Network,
  Payment,
  Pencil,
  Person,
  PluraCategory,
} from "@aperturs/ui/icons";

import { ModeToggle } from "../theme-toggle";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar-ui";

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
      {
        subText: "New Post",
        subIcon: <Pencil />,
        url: "/post",
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

export function SidebarComponent() {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const currentPath = usePathname();

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-card">
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {AccordanceMenuList.map((link) => (
              <div key={link.text}>
                <h2 className="mb-3 flex text-xs">{open ? link.text : ""}</h2>
                <div className="flex flex-col gap-3">
                  {link.items.map((item) => (
                    <SidebarLink
                      className={`${currentPath.includes(item.url) ? "bg-secondary " : ""} group my-1 cursor-pointer`}
                      key={item.url}
                      link={{
                        label: item.subText,
                        href: item.url,
                        icon: item.subIcon,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <hr className="dark:border-neutral my-8 border-neutral-300" />
          {bottomMenu.map((link) => (
            <SidebarLink
              key={link.text}
              link={{
                label: link.text,
                href: link.url,
                icon: link.icon,
              }}
            />
          ))}
        </div>

        {/* <div>
          <SidebarLink
            link={{
              label: "Memoize",
              href: "#",
              icon: <PiSignOutDuotone className="size-7" />,
            }}
            onClick={() => {
              signOut();
            }}
          />
        </div> */}
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 hidden items-center space-x-2 py-1 text-sm font-normal md:flex"
    >
      <LogoIcon />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow whitespace-pre font-medium text-primary"
      >
        Aperturs
      </motion.span>
      <ModeToggle />
      <span className="w-6" />
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 hidden items-center space-x-2 py-1 text-sm font-normal text-black md:flex"
    >
      <Image
        src="/logo.svg"
        alt="brand"
        className="h-8 w-8 dark:brightness-0 dark:invert"
        width={8}
        height={8}
      />
    </Link>
  );
};
