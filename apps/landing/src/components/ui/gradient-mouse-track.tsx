/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';


import { cn } from "@aperturs/ui/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export default function GraidientMouseWrapper({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    const radius = 1000; // change this to increase the rdaius of the hover effect
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
            ${visible ? radius + "px" : "0px"} circle at  0px 0px,
            #0000 0%,
            transparent 80%
          )
        `,
        }}
        onMouseMove={handleMouseMove}
        // onMouseEnter={() => setVisible(true)}
        // onMouseLeave={() => setVisible(false)}
        className={cn(
          "p-0 md:p-[5px] relative z-0   transition duration-300  focus-within:z-10",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }