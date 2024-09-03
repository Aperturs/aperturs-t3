"use client";

import React, { createContext, useContext, useState } from "react";

import type { PreferenceType } from "@aperturs/validators/personalization";

import type { Topic } from "./topic-selector";

// Create the context
interface DetailsContextType {
  selectedTopic: string[];
  setSelectedTopic: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubTopic: Topic[];
  setSelectedSubTopic: React.Dispatch<React.SetStateAction<Topic[]>>;
  whatYouPost: Topic[];
  setWhatYouPost: React.Dispatch<React.SetStateAction<Topic[]>>;
  preferences: Record<string, PreferenceType>;
  setPreferences: React.Dispatch<
    React.SetStateAction<Record<string, PreferenceType>>
  >;
  reasonsForPosting: Topic[];
  setReasonsForPosting: React.Dispatch<React.SetStateAction<Topic[]>>;
  toneOfVoice: Topic[];
  setToneOfVoice: React.Dispatch<React.SetStateAction<Topic[]>>;
  yourPosition: Topic[];
  setYourPosition: React.Dispatch<React.SetStateAction<Topic[]>>;
  moreDetails: string;
  setMoreDetails: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with an undefined default value
const DetailsContext = createContext<DetailsContextType | undefined>(undefined);

// Create a custom hook to use the DetailsContext
export const useDetailsContext = () => {
  const context = useContext(DetailsContext);
  if (!context) {
    throw new Error("useDetailsContext must be used within a DetailSProvider");
  }
  return context;
};
// Create a provider component
export const DetailsProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState<Topic[]>([]);
  const [preferences, setPreferences] = useState<
    Record<string, PreferenceType>
  >({
    emoji: "No",
    hashtags: "Remove",
    firstLetterCapital: "Auto",
    punctuation: "Auto",
    authorName: "Sometimes",
  });

  const [whatYouPost, setWhatYouPost] = useState<Topic[]>([]);
  const [reasonsForPosting, setReasonsForPosting] = useState<Topic[]>([]);
  const [toneOfVoice, setToneOfVoice] = useState<Topic[]>([]);
  const [yourPosition, setYourPosition] = useState<Topic[]>([]);
  const [moreDetails, setMoreDetails] = useState<string>("");

  return (
    <DetailsContext.Provider
      value={{
        selectedTopic,
        setSelectedTopic,
        selectedSubTopic,
        setSelectedSubTopic,
        preferences,
        setPreferences,
        whatYouPost,
        setWhatYouPost,
        reasonsForPosting,
        setReasonsForPosting,
        toneOfVoice,
        setToneOfVoice,
        yourPosition,
        setYourPosition,
        moreDetails,
        setMoreDetails,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};
