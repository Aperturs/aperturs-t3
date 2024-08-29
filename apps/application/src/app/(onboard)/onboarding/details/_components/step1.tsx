"use client";

import type { ComponentType } from "react";
import { useState } from "react";

import { Badge } from "@aperturs/ui/badge";
import { MultiSelect } from "@aperturs/ui/multi-select";

import { topicsList } from "./content-types";
import { useDetailsContext } from "./details-provider";

const options = topicsList.map((topic) => {
  const IconComponent: ComponentType<{ className?: string }> = () => (
    <span className="px-2">{topic.icon}</span>
  );

  return {
    value: topic.value,
    label: topic.label,
    icon: IconComponent, // Now this is a component type
  };
});
export default function StepOne() {
  const { selectedTopic, setSelectedTopic } = useDetailsContext();

  return (
    <div>
      <h2 className="text-lg font-semibold">Select your Niche </h2>
      <p className="mb-3 mt-0 text-sm text-muted-foreground">
        Choose topic you create content
      </p>
      <MultiSelect
        options={options}
        onValueChange={setSelectedTopic}
        defaultValue={selectedTopic}
        placeholder="Select your Field of Interest"
        variant="inverted"
        animation={2}
        maxCount={3}
        maximumAllowed={3}
      />
    </div>
  );
}
