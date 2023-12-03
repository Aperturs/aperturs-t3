// LinkedInPostCreation.tsx
import React from "react";

interface ContentCreationProps {
  content: string;
  onContentChange: (newContent: string) => void;
  sync: boolean;
}

const ContentCreation: React.FC<ContentCreationProps> = ({
  content,
  onContentChange,
  sync,
}) => {
  return (
    <div className="relative">
      <textarea
        className="clip-content max-h-[700px] min-h-[300px] w-full resize-none border border-transparent bg-transparent px-3  py-2.5 font-normal outline-none focus:outline-none"
        // value={content}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="What do you want to talk about?"
        disabled={sync}
      />
    </div>
  );
};

export default ContentCreation;
