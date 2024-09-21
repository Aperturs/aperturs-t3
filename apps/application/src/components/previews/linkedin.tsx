"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Repeat2, Send, ThumbsUp } from "lucide-react";
import { AiFillLike } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { PiHandsClappingDuotone } from "react-icons/pi";

interface LinkedInPreviewProps {
  name?: string;
  avatar?: string;
  content?: string;
  likes?: number;
  comments?: number;
  children?: React.ReactNode;
  showReactions?: boolean;
}

const truncateContentByLines = (
  text: string,
  maxLines: number,
  maxCharsPerLine: number,
) => {
  const words = text.split(/\s+/); // Split by any whitespace (space or newline)
  let truncated = "";
  let line = "";
  let lines = 0;

  for (const word of words) {
    // Check if adding the next word exceeds the line length
    if (line.length + word.length + 1 <= maxCharsPerLine) {
      line += (line ? " " : "") + word; // add word with a space if needed
    } else {
      truncated += line + "\n"; // add the line and go to the next one
      line = word; // start new line with the current word
      lines++;

      // Stop if we reached the max number of lines
      if (lines === maxLines - 1) {
        truncated += line; // Add the last line
        return truncated;
      }
    }
  }

  // Add the remaining text if it's under the max lines limit
  if (line) {
    truncated += line;
  }

  return truncated;
};
export default function LinkedInPreview({
  name = "John Doe",
  avatar = "/profile.jpeg",
  content = `Leveling up 
`,
  likes = 42,
  comments = 7,
  children,
  showReactions = true,
}: LinkedInPreviewProps) {
  console.log(content, "conte");
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  // Use the new truncateContentByLines function
  const displayContent = truncateContentByLines(content, 3, 40);

  const renderContent = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className=" max-w-xl overflow-hidden rounded-lg border  bg-card">
      <div className="p-4">
        <div className="mb-4 flex items-center">
          <Image
            width={48}
            height={48}
            className="mr-4 h-12 w-12 rounded-full"
            src={avatar}
            alt={`${name}'s avatar`}
          />
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">3rd+</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="whitespace-pre-line">{content}</p>
        </div>
        {showReactions && (
          <>
            <div className="flex items-center justify-between">
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1 flex -space-x-1">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 p-1 text-xs">
                      <AiFillLike className="-scale-x-100 stroke-blue-800 text-blue-300" />
                    </span>
                    <span className="flex h-4 w-4  items-center justify-center rounded-full bg-red-500 p-1 ">
                      <FaHeart className="stroke-red-800 text-red-300" />
                    </span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                      <PiHandsClappingDuotone />
                    </span>
                  </span>
                  {likes}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                <span>{comments} comments</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <button className="flex items-center rounded px-2 py-1 text-gray-700 hover:bg-gray-100">
                  <ThumbsUp className="mr-1 h-5 w-5" />
                  Like
                </button>
                <button className="flex items-center rounded px-2 py-1 text-gray-700 hover:bg-gray-100">
                  <MessageSquare className="mr-1 h-5 w-5" />
                  Comment
                </button>
                <button className="flex items-center rounded px-2 py-1 text-gray-700 hover:bg-gray-100">
                  <Repeat2 className="mr-1 h-5 w-5" />
                  Repost
                </button>
                <button className="flex items-center rounded px-2 py-1 text-gray-700 hover:bg-gray-100">
                  <Send className="mr-1 h-5 w-5" />
                  Send
                </button>
              </div>
            </div>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
