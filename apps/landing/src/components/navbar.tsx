"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@aperturs/ui/button";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 400); // Change 100 to adjust when the navbar should shrink
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className={`sticky left-1/2 top-3 z-[90]  max-w-screen-2xl   rounded-md border bg-background/60 py-3 backdrop-blur `}
      animate={{
        width: isScrolled ? "50%" : "100%",
        translateX: isScrolled ? "-50%" : "0%",
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Logo
          </Link>

          <div className="hidden space-x-8 md:flex">
            <Link href="/features" className="text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link
              href="/solutions"
              className="text-gray-600 hover:text-primary"
            >
              Solutions
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
          </div>

          <div className="hidden md:block">
            <Button>Login</Button>
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

        {isMobileMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
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
            <Button className="w-full">Login</Button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
