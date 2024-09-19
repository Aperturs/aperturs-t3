"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { motion, useScroll, useTransform } from "framer-motion";

import { Card, CardContent } from "@aperturs/ui/card";
import { cn } from "@aperturs/ui/lib/utils";

const painPoints = [
  {
    title: "Too Busy to Post Regularly?",
    problem:
      "You want to stay active on LinkedIn but have no time to post every day.",
    solution:
      "With Aperturs, you can save drafts and schedule your posts ahead of time. Plan your week in minutes!",
  },
  {
    title: "Running Out of Content Ideas?",
    problem: "Creating new and engaging content is tough.",
    solution:
      "Aperturs helps you generate content from articles and videos. Keep your feed fresh and interesting effortlessly.",
  },
  {
    title: "Not Sure What to Say?",
    problem: "You want your posts to stand out but don’t know how.",
    solution:
      "Our smart tools suggest the best topics and help you craft posts that connect with your audience.",
  },
];

export default function CardParalax() {
  const gallery = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function raf(time: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <section ref={gallery} className="relative py-24">
      {/* <div className="hover:dark:bg-[#020202] hover:bg-slate-50 border mx-2 rounded-lg "> */}
      <motion.div
        ref={headerRef}
        className="sticky top-24 z-10 flex items-center justify-center"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        {" "}
        <h1 className="my-6 text-center text-3xl font-bold md:text-5xl">
          Your Problems, Our Solutions
        </h1>
      </motion.div>
      {/* </div> */}

      {painPoints.map((item, index) => {
        const targetScale = 1 - (painPoints.length - index - 1) * 0.05;
        return (
          <CardContainer
            key={item.title}
            title={item.title}
            problem={item.problem}
            solution={item.solution}
            index={index}
            targetScale={targetScale}
            progress={scrollYProgress}
          />
        );
      })}
    </section>
  );
}

function CardContainer({
  image,
  title,
  problem,
  solution,
  index,
  targetScale,
  progress,
}: {
  index: number;
  image?: string;
  title: string;
  problem: string;
  solution: string;
  targetScale: number;
  progress: MotionValue<number>;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const range = [index * 0.125, 1];
  const cardScale = useTransform(progress, range, [1, targetScale]);
  const width = typeof window !== "undefined" ? window.innerWidth : 1920;

  return (
    <div
      ref={container}
      className="sticky top-0 flex h-[50dvh] w-full  items-center justify-center py-24 md:h-[70dvh]"
    >
      <motion.div
        className={cn(
          "relative w-full  p-20 max-w-4xl grid place-content-center overflow-hidden px-5 sm:px-8 lg:px-10 xl:px-0",
        )}
        style={{
          scale: cardScale,
          top: `calc(-5% + ${index * (width < 640 ? 15 : 30)}px)`,
        }}
      >
        <Card className="flex h-[400px] w-full ">
          <div className="grid h-full w-[30%] place-content-center border-r">
            <h3 className="text-2xl font-medium md:text-3xl">{index + 1}</h3>
          </div>
          <CardContent className="flex flex-col items-start justify-center p-2 md:p-6">
            {/* <motion.div
                className="w-full h-[30vh] md:h-[50vh] aspect-video lg:h-[70vh] rounded-lg "
                style={{
                  scale,
                }}
              >
               
              </motion.div> */}
            <h1 className="mb-4 text-left text-2xl font-semibold md:text-3xl">
              {title}
            </h1>
            <p className="mb-2 text-left text-xl font-medium md:text-2xl">
              {problem}
            </p>
            <p className="text-left text-xl font-normal md:text-2xl">
              {solution}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
