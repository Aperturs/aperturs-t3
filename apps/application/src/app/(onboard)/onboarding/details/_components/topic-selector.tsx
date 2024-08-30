"use client";

import type { KeyboardEvent } from "react";
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
import { Input } from "@aperturs/ui/input";
import { cn } from "@aperturs/ui/lib/utils";

export interface Topic {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export default function TopicsSelector({
  topics,
  setSelectedTopics,
  selectedTopics,
  allowAddOptions = false,
  showOnlySelected = false,
  maxAllowed,
  topicClassName,
  showDescription = false,
}: {
  topics: Topic[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  selectedTopics: Topic[];
  allowAddOptions?: boolean;
  showOnlySelected?: boolean;
  maxAllowed?: number;
  topicClassName?: string;
  showDescription?: boolean;
}) {
  const [newSubTopic, setNewSubTopic] = useState("");
  const [ref, { height }] = useMeasure();

  const [localTopics, setLocalTopics] = useState(topics);

  const handleAddSubTopic = () => {
    setLocalTopics((prev) => [
      ...prev,
      {
        value: newSubTopic,
        label: newSubTopic,
        icon: "📝",
      },
    ]);
    if (newSubTopic.trim() !== "") {
      setSelectedTopics((prev) => [
        ...prev,
        {
          value: newSubTopic,
          label: newSubTopic,
          icon: "📝",
        },
      ]);
      setNewSubTopic("");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Execute your command on Enter key press
      handleAddSubTopic();
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <MotionConfig
          transition={{
            duration: 0.4,
            type: "spring",
            bounce: showOnlySelected ? 0 : undefined,
          }}
        >
          <motion.div
            initial={{ height: "auto" }}
            animate={{ height: height > 0 ? height : undefined }}
          >
            <motion.ul ref={ref} className="mt-4 flex w-full flex-wrap gap-2">
              <LayoutGroup>
                <AnimatePresence initial={false} mode="popLayout">
                  {localTopics
                    .filter(
                      (topic) =>
                        !showOnlySelected ||
                        selectedTopics.some(
                          (item) => item.value === topic.value,
                        ),
                    )
                    .map((topic) => (
                      <SingleTopic
                        key={topic.value}
                        topic={topic}
                        isSelected={selectedTopics.some(
                          (item) => item.value === topic.value,
                        )}
                        setValues={setSelectedTopics}
                        selectedLength={selectedTopics.length}
                        maxAllowed={maxAllowed}
                        topicClassName={topicClassName}
                        showDescription={showDescription}
                      />
                    ))}
                </AnimatePresence>
              </LayoutGroup>
            </motion.ul>
          </motion.div>
        </MotionConfig>

        {allowAddOptions && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="text"
              value={newSubTopic}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewSubTopic(e.target.value)}
              placeholder="Add new topic"
              className="border px-2 py-1"
            />
            <Button variant="secondary" onClick={handleAddSubTopic}>
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleTopic({
  selectedLength,
  maxAllowed,
  topic,
  setValues,
  isSelected,
  topicClassName,
  showDescription,
}: {
  topic: Topic;
  setValues: React.Dispatch<React.SetStateAction<Topic[]>>;
  isSelected: boolean;
  selectedLength: number;
  maxAllowed?: number;
  topicClassName?: string;
  showDescription?: boolean;
}) {
  const onClickHandler = () => {
    if (maxAllowed && selectedLength >= maxAllowed && !isSelected) {
      return;
    }
    setValues((prev) => {
      const isSelected = prev.some((item) => item.value === topic.value);

      if (isSelected) {
        // Remove the topic if it's already selected
        return prev.filter((item) => item.value !== topic.value);
      } else {
        // Add the topic if it's not selected
        return [...prev, topic];
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
          " rounded-full border border-[#363538]  bg-accent-foreground/90 px-4 py-2 text-[#e8e4ed]",
          isSelected && " border-[#2c2845] bg-accent-foreground text-accent",
          topicClassName,
        )}
        onClick={onClickHandler}
      >
        <motion.div layout className="my-0 flex items-center gap-2 py-0">
          <motion.span layout className="inline-block">
            {topic.icon} {topic.label}
          </motion.span>
          {isSelected && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <IoCheckmarkCircle />
            </motion.span>
          )}
        </motion.div>
        {showDescription && topic.description && (
          <motion.span layout className="text-sm ">
            ({topic.description})
          </motion.span>
        )}
      </motion.button>
    </motion.li>
  );
}
