"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@aperturs/ui/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <div
        className={cn(
          "absolute z-40 flex items-center justify-between p-4 ",
        //   isOpen && "bg-transparent ",
        )}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn("h-20 transition-colors duration-500 ease-in-out", isOpen && "text-white")}
        >
          Menu
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav"
            initial={{ height: 0 }}
            animate={{ height: 500 }}
            exit={{ height: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-scroll"
          >
            <nav className="flex min-h-32 flex-col items-center justify-between  bg-black  pt-28 text-white">
              <div className="grid w-full grid-cols-2">
                <Link
                  href="/"
                  className="flex hover:bg-[#171717] transition-colors duration-200 ease-in-out w-full items-center justify-center border-r border-t border-b border-gray-500 py-16 text-center text-4xl"
                >
                  Home
                </Link>
                <Link
                  href="/"
                  className="flex  hover:bg-[#171717] transition-colors duration-200 ease-in-out w-full items-center justify-center border-y border-gray-500 py-16 text-center text-4xl"
                >
                  Home
                </Link>
              </div>
              <div className="grid w-full grid-cols-2">
                <Link
                  href="/"
                  className="flex w-full hover:bg-[#171717] transition-colors duration-200 ease-in-out items-center justify-center border-r border-b border-gray-500 py-16 text-center text-4xl"
                >
                  Home
                </Link>
                <Link
                  href="/"
                  className="flex w-full items-center hover:bg-[#171717] transition-colors duration-200 ease-in-out justify-center border-b border-gray-500 py-16 text-center text-4xl"
                >
                  Home
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
