"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@aperturs/ui/button";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 400); // Change 100 to adjust when the navbar should shrink
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        mobileMenuRef.current.style.maxHeight = `${mobileMenuRef.current.scrollHeight}px`;
      } else {
        mobileMenuRef.current.style.maxHeight = "0";
      }
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className={`sticky top-3 z-[90]  max-w-screen-2xl   rounded-md border bg-background/90 py-3 backdrop-blur-[10px] `}
      animate={{
        width: isScrolled && !isMobileMenuOpen ? "70%" : "100%",
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
      }}
    >
      <div
        // animate={{
        //   height: isMobileMenuOpen ? "230px" : "100%",
        //   transition: {
        //     duration: 0.3,
        //     type: "spring",
        //     stiffness: 100,
        //     damping: 20,
        //   },
        // }}
        className="container"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <Image
              src="/logo.svg"
              alt="Aperturs"
              className="invert"
              width={40}
              height={40}
            />
          </Link>

          <div className="hidden space-x-8 md:flex">
            <Link
              href="#solutions"
              className="text-gray-600 hover:text-primary"
            >
              Solutions
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-primary"
            >
              How it works
            </Link>
            <Link href="" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
          </div>

          <div className="hidden md:block ">
            {/* <Button>Login</Button> */}
            <button
              style={{
                overflow: "hidden",
              }}
              className="group relative  rounded-md bg-primary px-6 py-3  text-sm font-semibold text-white"
            >
              <Link
                href="https://app.aperturs.com/sign-up"
                className="h-full w-full px-6 py-3"
              >
                <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                  Want to grow on LinkedIn?
                </span>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-lime-300 opacity-0 transition-opacity duration-500  group-hover:opacity-100">
                  Start 7-day free trial
                </span>
                <div className="absolute inset-0 -translate-y-full transform bg-lime-700/30 transition-transform duration-500 ease-in-out group-hover:h-[150%] group-hover:translate-y-0 group-hover:rounded-b-[100%]" />
              </Link>
            </button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <div
          ref={mobileMenuRef}
          className="overflow-hidden transition-all duration-500 ease-in-out md:hidden"
          style={{ maxHeight: 0 }}
        >
          <div className="space-y-4 py-4">
            <Link
              href="/features"
              className="block text-gray-600 hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/solutions"
              className="block text-gray-600 hover:text-primary"
            >
              Solutions
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-600 hover:text-primary"
            >
              Pricing
            </Link>
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
