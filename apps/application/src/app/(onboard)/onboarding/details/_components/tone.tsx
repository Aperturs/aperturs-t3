import React from "react";

import { linkedinContentOptions } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";
import TopicsSelector from "./topic-selector";

export default function ToneOfPosting() {
  const { toneOfVoice, setToneOfVoice } = useDetailsContext();
  return (
    <div>
      <h2 className="text-lg font-semibold">
        What is Your Writing Style? (max 3)
      </h2>
      <p className="mb-3 mt-0 text-sm text-muted-foreground">
        Choose the tone of voice you use when posting
      </p>
      <TopicsSelector
        selectedTopics={toneOfVoice}
        setSelectedTopics={setToneOfVoice}
        topics={linkedinContentOptions.toneOfVoice}
        allowAddOptions
        maxAllowed={3}
        topicClassName="rounded-md"
        showDescription
      />
    </div>
  );
}
