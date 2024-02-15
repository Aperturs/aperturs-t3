"use client";

import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import NavList from "./navList";

export default function ProjectNavBar({ params }: { params: { id: string } }) {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Card className="max-w-fit px-6 py-3">
      <div className="flex items-start justify-center">
        <div className="hidden lg:block">
          <NavList params={params} />
        </div>
        <Button
          size="icon"
          className="ml-auto lg:hidden"
          // ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </Button>
      </div>
      {/* <Collapse open={openNav}></Collapse> */}
      <AnimatePresence>
        {openNav && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-scroll"
          >
            <NavList params={params} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
