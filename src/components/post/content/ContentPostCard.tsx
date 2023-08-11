import { Switch } from "@material-tailwind/react";
// import { PostContext } from '../postWrapper';
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import ContentPostCreation from "./textarea";

// function convertTweetsToPlaintext(tweets: Tweet[]): string {
//   let plaintext = "";

//   for (let i = 0; i < tweets.length; i++) {
//     const tweet = tweets[i];
//     if (tweet) plaintext += tweet.text + "\n\n"; // Now this will concatenate strings properly
//   }

//   return plaintext;
// }

function ContentPostCard({ id }: { id: number }) {
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
    let updatedContent = content;
    if (id === 0) {
      setDefaultContent(textContent);
      console.log(updatedContent);
    }
    if (sync) {
      console.log("updting sync content", sync);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return { ...item, content: defaultContent };
        }
        return item;
      });
      console.log("default content", sync, updatedContent);
    } else {
      console.log("updting normal content content", sync);
      updatedContent = content.map((item) => {
        if (item.id === id) {
          return { ...item, content: textContent };
        }
        return item;
      });
      console.log(content);
    }
    setContent(updatedContent);
  };

  useEffect(() => {
    console.log("sync", sync);
    onChangeContent(defaultContent);
  }, [sync]);

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      {/* <div className="flex gap-3">
          <Avatar
            src={"/user.png"||"https://i.pinimg.com/originals/90/a7/f6/90a7f67864acea71fb5ffed6aa6298cb.jpg"}
            size="lg"
            color="blue"
            className="mb-4"
          />
            <div>
              <div className="text-lg font-bold">John Doe</div>
              <div className="text-sm text-gray-500">@John</div>
            </div>
        </div> */}
      <ContentPostCreation
        content={
          id === 0
            ? defaultContent
            : content.find((item) => item.id === id)?.content || ""
        }
        onContentChange={onChangeContent}
        sync={sync}
      />
      {id != 0 && (
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
