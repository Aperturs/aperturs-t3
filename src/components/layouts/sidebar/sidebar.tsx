"use client";

import { Bars2Icon } from "@heroicons/react/24/outline";
import { IconButton, List } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { ModeToggle } from "../theme-toggle";
import AccordianMenu from "./accordianMenu";
import BottomMenu from "./bottomMenu";
import { CommandMenu } from "./command-menu";
import { Button } from "~/components/ui/button";

export default function SideBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  const pathName = usePathname();

  useEffect(() => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  }, [pathName]);

  return (
    <Card className="mt-2 w-full overflow-scroll p-4 shadow-md lg:fixed lg:left-4  lg:h-[calc(100vh-2rem)] lg:max-w-[18rem]">
      <div className="mb-2 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="brand"
            className="h-8 w-8 dark:invert"
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
          <CommandMenu />
          <ModeToggle />
          <Button
            size="icon"
            onClick={toggleIsNavOpen}
            className="p-0 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block">
        <AccordianMenu />
        <hr className="border-blue-gray-50 my-2" />
        <BottomMenu />
      </div>
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-scroll"
          >
            <List>
              <AccordianMenu />
              <hr className="border-blue-gray-50 my-2" />
              <BottomMenu />
            </List>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <UpgradeAlert /> */}
    </Card>
  );
}
