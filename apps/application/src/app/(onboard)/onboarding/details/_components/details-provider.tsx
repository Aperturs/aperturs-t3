// context/DetailsContext.js

import React, { createContext, useContext, useState } from "react";

// Create the context
interface DetailsContextType {
  selectedTopic: string[];
  setSelectedTopic: React.Dispatch<React.SetStateAction<string[]>>;
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

  return (
    <DetailsContext.Provider value={{ selectedTopic, setSelectedTopic }}>
      {children}
    </DetailsContext.Provider>
  );
};
