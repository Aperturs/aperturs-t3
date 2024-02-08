import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BsFillClipboardDataFill, BsFileCodeFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

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

export default function AccordanceMenu() {
  const pathName = usePathname();
  const currentPath = (url: string) => {
    return url.includes(pathName || "");
  };

  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="h-[500px] max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {AccordanceMenuList.map((item, index) => {
          return (
            <CommandGroup key={index} heading={item.text} className="py-3">
              {item.items.map((subItem) => (
                <CommandItem
                  key={subItem.url}
                  className={`${
                    currentPath(subItem.url)
                      ? "bg-primary text-white dark:text-primary-foreground"
                      : ""
                  } group my-1 cursor-pointer py-3`}
                >
                  <Link
                    href={subItem.url}
                    className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent group-hover:font-semibold md:w-full"
                  >
                    {subItem.subIcon}
                    <span>{subItem.subText}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </Command>
  );
}
