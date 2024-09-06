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
}

export default function LinkedInPreview({
  name = "John Doe",
  avatar = "/profile.jpeg",
  content = "This is a sample LinkedIn post content. It can be quite long, so we'll need to implement a'see more' fsdafsd feature to display it properly. This extra text is to ensure we have enough content to trigger the 'see more' functionality and demonstrate the exact 210-character limit.",
  likes = 42,
  comments = 7,
}: LinkedInPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    let truncated = text.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > maxLength - 20) {
      truncated = truncated.slice(0, lastSpaceIndex);
    }
    return truncated;
  };

  const displayContent = truncateContent(content, 210);

  const renderContent = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-lg border  bg-white">
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
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">3rd+</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">
            {renderContent(displayContent)}
            {content.length > 210 && !expanded && (
              <span className="text-gray-400">...</span>
            )}
          </p>
          {expanded && content.length > 210 && (
            <>
              <div className="my-2 border-t border-gray-200"></div>
              <p className="text-gray-700">
                {renderContent(content.slice(displayContent.length))}
              </p>
            </>
          )}
          {content.length > 210 && (
            <button
              onClick={toggleExpanded}
              className="font-medium text-gray-500 hover:underline focus:outline-none"
            >
              {expanded ? "" : "...see more"}
            </button>
          )}
        </div>
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
      </div>
    </div>
  );
}
