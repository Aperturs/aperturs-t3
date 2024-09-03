import React from "react";

import { linkedinContentOptions } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";
import TopicsSelector from "./topic-selector";

export default function AboutYourself() {
  const { yourPosition, setYourPosition } = useDetailsContext();
  return (
    <div>
      <h2 className="text-lg font-semibold">What is Your Position?</h2>
      <p className="mb-3 mt-0 text-sm text-muted-foreground">
        what is your current professional position?
      </p>
      <TopicsSelector
        selectedTopics={yourPosition}
        setSelectedTopics={setYourPosition}
        topics={linkedinContentOptions.positions}
        allowAddOptions
        maxAllowed={2}
      />
    </div>
  );
}
