"use client";

import { useEffect, useRef, useState } from "react";

import { Card } from "@aperturs/ui/card";
import { SocialType } from "@aperturs/validators/post";

import { useDebounce } from "~/hooks/useDebounce";
import FileUpload from "./fileUpload";
import ContentPostCreation from "./textarea";
import usePostUpdate from "./use-post-update";

// function convertTweetsToPlaintext(tweets: Tweet[]): string {
//   let plaintext = "";
//   for (let i = 0; i < tweets.length; i++) {
//     const tweet = tweets[i];
//     if (tweet) plaintext += tweet.text + "\n\n"; // Now this will concatenate strings properly
//   }
//   return plaintext;x
// }

function ContentPostCard({
  id,
  postType,
}: {
  id: string;
  postType: SocialType;
}) {
  // const [sync, setSync] = useState(false);

  const { updateContent, contentValue, currentFiles } = usePostUpdate(id);
  const [content, setContent] = useState<string>(contentValue);
  const debounceContent = useDebounce(content, 1000);
  const isExternalUpdate = useRef(false); // Ref to track the source of the update

  useEffect(() => {
    if (content !== contentValue) {
      isExternalUpdate.current = true; // Marking this update as external
      setContent(contentValue);
    }
  }, [contentValue]);

  // Effect for debouncing content updates
  useEffect(() => {
    if (!isExternalUpdate.current) {
      // Only update externally if the change did not originate from an external update
      updateContent(debounceContent);
    }
    isExternalUpdate.current = false; // Resetting the flag after applying any kind of update
  }, [debounceContent]);

  return (
    <Card className="my-2 w-full p-3">
      <ContentPostCreation
        content={content}
        onContentChange={(newContent) => {
          isExternalUpdate.current = false; // User initiated change
          setContent(newContent);
        }}
        // sync={sync}
      />
      <FileUpload id={id} uploadedFiles={currentFiles} postType={postType} />
      {/* {id != SocialType.Default && (
        <Switch
          label="Sync with Default"
          defaultChecked={sync}
          onChange={(e) => setSync(e.target.checked)}
          crossOrigin=""
        />
      )} */}
    </Card>
  );
}

export default ContentPostCard;
