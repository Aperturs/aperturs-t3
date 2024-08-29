/* eslint-disable @typescript-eslint/ban-types */
"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
} from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import { cn } from "@aperturs/ui/lib/utils";

import { Subtopic, topicsList } from "./content-types";
import { useDetailsContext } from "./details-provider";

type sportsTypes = Record<string, boolean>;

const sportsObject: sportsTypes = {
  Soccer: false,
  Basketball: false,
  Baseball: false,
  Tennis: false,
  Golf: false,
  Cricket: false,
  Rugby: false,
  Hockey: false,
  "Table Tennis": false,
  Badminton: false,
  Volleyball: false,
  "American Football": false,
  Boxing: false,
  MMA: false,
  Wrestling: false,
  Swimming: false,
  Athletics: false,
  Cycling: false,
  Gymnastics: false,
  Skiing: false,
  Snowboarding: false,
  Skateboarding: false,
  Surfing: false,
  Rowing: false,
  Sailing: false,
  Fencing: false,
  Judo: false,
  Karate: false,
  Taekwondo: false,
  Archery: false,
  Equestrian: false,
  Lacrosse: false,
  Handball: false,
  Softball: false,
  Squash: false,
  Racquetball: false,
  Bobsleigh: false,
  Curling: false,
  "Figure Skating": false,
  Diving: false,
};

export default function Step2() {
  const { selectedTopic } = useDetailsContext();
  const [filter, setFilter] = useState(false);

  const [values, setValues] = useState(sportsObject);
  const [selected, setSelected] = useState<Subtopic[]>([]);

  const onClickHandler = () => setFilter(!filter);

  const initialTopics = topicsList
    .map((topic) => {
      if (selectedTopic.includes(topic.value)) {
        return topic;
      } else {
        return null;
      }
    })
    .filter((topic) => topic !== null);

  const [ref, { height }] = useMeasure();

  return (
    <div className="flex  w-full items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold tracking-tight">
          Pick All the Topics You Create Content On
        </h1>
        <MotionConfig
          transition={{
            duration: 0.4,
            type: "spring",
            bounce: filter ? 0 : undefined,
          }}
        >
          <motion.div
            initial={{ height: "auto" }}
            animate={{ height: height > 0 ? height : undefined }}
          >
            <motion.ul ref={ref} className="mt-4 flex w-full flex-wrap gap-2">
              <LayoutGroup>
                <AnimatePresence initial={false} mode="popLayout">
                  {initialTopics.map((topic) => (
                    <div key={topic.value} className=" py-1">
                      <h2 className="mb-3 text-lg font-semibold">
                        {topic.label} {topic.icon}
                      </h2>
                      <ul className="flex w-full flex-wrap gap-2">
                        {topic.subtopics
                          .filter(
                            (subtopic) =>
                              !filter ||
                              selected.some(
                                (item) => item.value === subtopic.value,
                              ),
                          )
                          .map((subtopic) => (
                            <SingleTopic
                              key={subtopic.value}
                              subTopic={subtopic}
                              isSelected={selected.some(
                                (item) => item.value === subtopic.value,
                              )}
                              setValues={setSelected}
                            />
                          ))}
                      </ul>
                    </div>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </motion.ul>
          </motion.div>
        </MotionConfig>

        <div className="flex justify-center py-8">
          <Button
            className=" border-[#2d2845] bg-[#10111c] px-4 text-[#5f5aea] duration-200 active:scale-95"
            onClick={onClickHandler}
          >
            {filter ? "Show All" : "Show Selected"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SingleTopic({
  subTopic,
  setValues,
  isSelected,
}: {
  subTopic: Subtopic;
  setValues: React.Dispatch<React.SetStateAction<Subtopic[]>>;
  isSelected: boolean;
}) {
  const onClickHandler = () => {
    setValues((prev) => {
      const isSelected = prev.some((item) => item.value === subTopic.value);

      if (isSelected) {
        // Remove the subtopic if it's already selected
        return prev.filter((item) => item.value !== subTopic.value);
      } else {
        // Add the subtopic if it's not selected
        return [...prev, subTopic];
      }
    });
  };

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      <motion.button
        layout
        className={cn(
          "flex h-10 items-center gap-2 border border-[#363538] bg-[#141417] px-4 text-[#a1a1a3]",
          isSelected && "border-[#2c2845] bg-[#10101c] text-[#b0b5f0]",
        )}
        style={{ borderRadius: 9999 }}
        onClick={onClickHandler}
      >
        <motion.span layout className="inline-block">
          {subTopic.icon} {subTopic.label}
        </motion.span>

        {isSelected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <IoCheckmarkCircle />
          </motion.span>
        )}
      </motion.button>
    </motion.li>
  );
}
