import { Switch } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import ContentPostCreation from "./textarea";
import { SocialType } from "~/types/post-enums";

// function convertTweetsToPlaintext(tweets: Tweet[]): string {
//   let plaintext = "";

//   for (let i = 0; i < tweets.length; i++) {
//     const tweet = tweets[i];
//     if (tweet) plaintext += tweet.text + "\n\n"; // Now this will concatenate strings properly
//   }

//   return plaintext;
// }

function ContentPostCard({ id }: { id: string }) {
  // const {setLinkedinPost,linkedinPost,sync,tweets,setSync } = useContext(PostContext)

  const { setContent, content, setDefaultContent, defaultContent } = useStore(
    (state) => ({
      content: state.content,
      setDefaultContent: state.setDefaultContent,
      defaultContent: state.defaultContent,
      tweets: state.tweets,
      setContent: state.setContent,
    }),
    shallow
  );
  const [sync, setSync] = useState(false);

  const onChangeContent = (textContent: string) => {

    if (id === SocialType.Default) {
      setDefaultContent(textContent);
    }
    const updatedContent = content.map((item) => {
      if (item.id === id) {
        return { ...item, content: textContent };
      }
      return item;
    });
    setContent(updatedContent);
  }

  useEffect(() => {
    if (sync) {
      onChangeContent(defaultContent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync,defaultContent]);

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <ContentPostCreation
        content={
          id === SocialType.Default
            ? defaultContent
            : content.find((item) => item.id === id)?.content || ""
        }
        onContentChange={onChangeContent}
        sync={sync}
      />
      {id != SocialType.Default && (
        <Switch
          label="Sync with Default"
          color="blue"
          defaultChecked={sync}
          onChange={(e) => setSync(e.target.checked)}
        />
      )}
    </div>
  );
}

export default ContentPostCard;
