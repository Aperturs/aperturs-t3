"use client";

import { useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
} from "framer-motion";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import { topicsList } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";
import TopicsSelector from "./topic-selector";

export default function Step2() {
  const { selectedTopic, selectedSubTopic, setSelectedSubTopic } =
    useDetailsContext();
  const [filter, setFilter] = useState(false);

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
      <div className="w-full">
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
              {initialTopics.map((topic) => (
                <div key={topic.value} className=" py-1">
                  <h2 className="mb-3 text-lg font-semibold">
                    {topic.label} {topic.icon}
                  </h2>
                  <ul className="flex w-full flex-wrap gap-2">
                    <TopicsSelector
                      selectedTopics={selectedSubTopic}
                      setSelectedTopics={setSelectedSubTopic}
                      topics={topic.subtopics}
                      showOnlySelected={filter}
                      allowAddOptions
                    />
                  </ul>
                </div>
              ))}
            </motion.ul>
          </motion.div>
        </MotionConfig>

        <div className="flex justify-center py-8">
          <Button
            variant="accent"
            // className=" border-[#2d2845] bg-[#10111c] px-4 text-[#9d9af6] duration-200 active:scale-95"
            onClick={onClickHandler}
          >
            {filter ? "Show All" : "Show Selected"}
          </Button>
        </div>
      </div>
    </div>
  );
}
