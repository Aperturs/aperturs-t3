// LinkedInPostCreation.tsx
import React from 'react';

interface ContentCreationProps {
  content: string;
  onContentChange: (newContent: string) => void;
  sync: boolean;
}

const ContentCreation: React.FC<ContentCreationProps> = ({ content, onContentChange,sync }) => {
  console.log("content creation",content)
  return (
    <div className="relative">
      <textarea
        className="w-full min-h-[300px] resize-none max-h-[700px] border border-transparent bg-transparent px-3 py-2.5  font-normal outline-none focus:outline-none clip-content"
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