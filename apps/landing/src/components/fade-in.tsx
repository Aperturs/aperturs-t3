"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FadeIn({ className, children, initialY, duration }: {className?:string, children: React.ReactNode, initialY?: number, duration?: number}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: initialY ?? -10 }} // Start from slightly above the final position
      animate={{ opacity: 1, y: 0 }} // End at the natural position
      transition={{ duration: duration ?? 1 }} // Adjust duration as needed
      className={className}
    >
      {children}
    </motion.div>
  );
}
