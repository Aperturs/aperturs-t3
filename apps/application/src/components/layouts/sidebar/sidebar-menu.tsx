"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "@aperturs/ui/lib/utils";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

import type { MenuItem } from "./accordian-menu-type";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}
export default function AccordanceMenu({
  accordanceMenuList,
}: {
  accordanceMenuList: MenuItem[];
}) {
  const pathName = usePathname();
  const currentPath = (url: string) => {
    return url.includes(pathName ?? "");
  };

  return (
    <div className="mt-3 w-full rounded-md bg-card p-2">
      {accordanceMenuList.map((item, index) => {
        return (
          <div key={index} className="py-3">
            <h2 className="mb-3 text-lg font-semibold">{item.text}</h2>
            <div className="flex flex-wrap gap-0">
              {item.items.map((subItem) => (
                <SidebarLink
                  key={subItem.url}
                  link={{
                    label: subItem.subText,
                    href: subItem.url,
                    icon: subItem.subIcon,
                  }}
                  className={`${
                    currentPath(subItem.url) ? "bg-accent " : ""
                  } group my-1 cursor-pointer`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface SidebarLinkProps extends Omit<LinkProps, "href"> {
  link: Links;
  className?: string;
  open?: boolean;
}

const SidebarLink = ({
  link,
  className,
  open = true,
  ...props
}: SidebarLinkProps) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex w-full items-center justify-start  gap-3 rounded-md p-2 py-3 transition-all hover:bg-accent  md:w-full",
        className,
      )}
      {...props}
    >
      {!open ? (
        <ToolTipSimple position="right" content={link.label}>
          {link.icon}
        </ToolTipSimple>
      ) : (
        link.icon
      )}
      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="inline-flex whitespace-pre p-0 text-sm text-primary transition duration-150 group-hover/sidebar:translate-x-1 "
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
