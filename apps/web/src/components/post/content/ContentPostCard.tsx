"use client";

import { useEffect, useState } from "react";

import { Card } from "@aperturs/ui/card";

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

//   return plaintext;
// }

function ContentPostCard({ id }: { id: string }) {
  // const [sync, setSync] = useState(false);

  const { updateContent, contentValue, currentFiles } = usePostUpdate(id);
  const [content, setContent] = useState<string>(contentValue);
  const debounceContent = useDebounce(content, 1000);

  useEffect(
    () => {
      updateContent(debounceContent);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debounceContent],
  );

  // const onChangeContent = (textContent: string) => {
  //   if (id === SocialType.Default) {
  //     setDefaultContent(textContent);
  //     const updatedContent = content.map((item) => {
  //       if (!item.unique) {
  //         return { ...item, content: textContent };
  //       }
  //       return item;
  //     });
  //     setContent(updatedContent);
  //   } else {
  //     const updatedContent = content.map((item) => {
  //       if (item.id === id) {
  //         return { ...item, content: textContent };
  //       }
  //       return item;
  //     });
  //     setContent(updatedContent);
  //     console.log(content);
  //   }
  // };

  // useEffect(() => {
  //   if (sync) {
  //     updateContent(defaultContent);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sync, defaultContent]);

  return (
    <Card className="my-2 w-full p-3">
      <ContentPostCreation
        content={content}
        onContentChange={setContent}
        // sync={sync}
      />
      <FileUpload id={id} uploadedFiles={currentFiles} />
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
