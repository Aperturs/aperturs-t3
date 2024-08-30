// context/DetailsContext.js

import React, { createContext, useContext, useState } from "react";

import type {
  PreferenceType,
  SubTopicType,
} from "@aperturs/validators/personalization";

// Create the context
interface DetailsContextType {
  selectedTopic: string[];
  setSelectedTopic: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSubTopic: SubTopicType[];
  setSelectedSubTopic: React.Dispatch<React.SetStateAction<SubTopicType[]>>;
  preferences: Record<string, PreferenceType>;
  setPreferences: React.Dispatch<
    React.SetStateAction<Record<string, PreferenceType>>
  >;
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
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopicType[]>([]);
  const [preferences, setPreferences] = useState<
    Record<string, PreferenceType>
  >({
    emoji: "No",
    hashtags: "Remove",
    firstLetterCapital: "Auto",
    punctuation: "Auto",
    authorName: "Sometimes",
  });

  return (
    <DetailsContext.Provider
      value={{
        selectedTopic,
        setSelectedTopic,
        selectedSubTopic,
        setSelectedSubTopic,
        preferences,
        setPreferences,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};
