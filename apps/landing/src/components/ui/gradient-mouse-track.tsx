/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { cn } from "@aperturs/ui/lib/utils";

export default function GraidientMouseWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const radius = 200; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = React.useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        "relative z-0 rounded-md p-0  transition duration-300  focus-within:z-10 md:p-[2px]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
