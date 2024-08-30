import type { ChangeEvent } from "react";
import React, { useRef } from "react";

import type { SocialType } from "@aperturs/validators/post";

import usePostUpdate from "../content/use-post-update";

interface SingleTweetProps {
  orderId: number;
  text: string;
  socialId?: string;
  socialType: SocialType;
  // onRemove: (id: number) => void;
  // onAdd: (id: number) => void;
}

const SingleTweet: React.FC<SingleTweetProps> = ({
  orderId,
  socialId,
  text,
  socialType,
  // onRemove,
  // onAdd,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [count, setCount] = React.useState(280 - text.length);

  console.log(socialId);

  const { updateContent, onRemoveTweet, addTweet } = usePostUpdate(
    orderId,
    socialId,
  );
  console.log("text", text);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust the height based on the content
    }
    setCount(280 - event.target.value.length);
    updateContent(newText);
  };

  return (
    <div className=" border-blue-gray-500  border-l-2 pl-3">
      {/* <Avatar src="/user.png" size="md" className="border-2 border-white" /> */}
      <textarea
        ref={textareaRef}
        className="min-h-[300px] w-full resize-none border border-transparent bg-transparent px-3  py-2.5 font-normal outline-none focus:outline-none"
        value={text}
        onChange={handleChange}
        placeholder="What's happening?"
      />
      {socialType === "TWITTER" && (
        <div className="flex items-center  justify-end">
          <span
            className={`${
              count > 0 ? "text-muted-foreground" : "text-red-600"
            } mr-2 text-sm`}
          >
            {count}
          </span>
          <button
            onClick={() => onRemoveTweet()}
            className="grid h-8 w-8 place-content-center rounded-full bg-red-600 text-white"
          >
            -
          </button>
          <button
            onClick={() => addTweet()}
            className="important ml-2 grid h-8 w-8 place-content-center rounded-full bg-primary text-white dark:text-black"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleTweet;
