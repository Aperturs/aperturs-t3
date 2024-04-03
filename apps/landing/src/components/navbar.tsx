"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FaGripLines } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { Button } from "@aperturs/ui/button";
import { cn } from "@aperturs/ui/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative w-full">
      <div className={cn("absolute z-40 flex w-full justify-center")}>
        <div
          className={cn(
            "flex w-full  max-w-screen-xl items-center justify-between px-6 pt-12 lg:px-8",
          )}
        >
          <p
            className={cn(
              "ease transition-colors duration-200",
              isOpen && "text-white",
            )}
          >
            Image
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button>Login</Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "h-auto w-auto p-2 text-xl transition-colors duration-300 ease-in-out",
                isOpen && "text-white",
              )}
            >
              {isOpen ? <IoClose /> : <FaGripLines />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-fit overflow-scroll"
          >
            <nav className="flex min-h-fit  flex-col items-center justify-between bg-neutral-950  pt-28 pb-7 text-3xl text-white">
              <NavLinks
                link1={{ href: "/login", text: "Login" }}
                link2={{ href: "/register", text: "Register" }}
              />
              <NavLinks
                link1={{ href: "/login", text: "Login" }}
                link2={{ href: "/register", text: "Register" }}
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

interface NavLinksProps {
  link1: { href: string; text: string };
  link2: { href: string; text: string };
}

function NavLinks({ link1, link2 }: NavLinksProps) {
  return (
    <div className="flex w-full justify-center border-b border-t border-neutral-800">
      <div className="grid w-full max-w-screen-xl  grid-cols-1   md:grid-cols-2">
        <Link
          href={link1.href}
          className="group relative isolate  border-neutral-800 px-8  py-10  max-md:border-b sm:py-16  sm:odd:pr-16 sm:even:border-l"
          // className="group relative  w-full items-center border-neutral-800 px-8  py-16 text-4xl  max-md:border-b md:border-r"
        >
          <span className="absolute inset-y-0 z-0 w-screen bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
          <span className="relative z-10">{link1.text}</span>
        </Link>
        <Link
          href={link2.href}
          className="group relative isolate  px-8 py-10   sm:py-16 sm:odd:pr-16  sm:even:border-l sm:even:border-neutral-800"
          // className="group relative  w-full items-center border-neutral-800 px-8  py-16 text-4xl  max-md:border-b md:border-r"
        >
          <span className="absolute inset-y-0 z-0 w-screen max-w-fit bg-neutral-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
          <span className="relative z-10">{link2.text}</span>
        </Link>
      </div>
    </div>
  );
}
