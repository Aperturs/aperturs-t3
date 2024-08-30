import React from "react";

import { linkedinContentOptions } from "@aperturs/validators/personalization";

import { useDetailsContext } from "./details-provider";
import TopicsSelector from "./topic-selector";

export default function WhatToPost() {
  const { setWhatYouPost, whatYouPost } = useDetailsContext();
  return (
    <div>
      <h2 className="text-lg font-semibold">What do you share?</h2>
      <p className="mb-3 mt-0 text-sm text-muted-foreground">
        Choose the topics you share content about
      </p>
      <TopicsSelector
        selectedTopics={whatYouPost}
        setSelectedTopics={setWhatYouPost}
        topics={linkedinContentOptions.whatYouPost}
        allowAddOptions
      />
    </div>
  );
}
