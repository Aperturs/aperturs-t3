import React from "react";

import { linkedinContentOptions } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";
import TopicsSelector from "./topic-selector";

export default function ReasonForPosting() {
  const { reasonsForPosting, setReasonsForPosting } = useDetailsContext();
  return (
    <div>
      <h2 className="text-lg font-semibold">Why do you share content?</h2>
      <p className="mb-3 mt-0 text-sm text-muted-foreground">
        What is your goal for sharing content on LinkedIn?
      </p>
      <TopicsSelector
        selectedTopics={reasonsForPosting}
        setSelectedTopics={setReasonsForPosting}
        topics={linkedinContentOptions.reasonsForPosting}
        allowAddOptions
      />
    </div>
  );
}
