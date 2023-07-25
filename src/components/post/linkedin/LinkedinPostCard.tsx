import { Switch } from "@material-tailwind/react";
import { useEffect } from "react";
import LinkedInPostCreation from "./textarea";
// import { PostContext } from '../postWrapper';
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";

function convertTweetsToPlaintext(tweets: Tweet[]): string {
  let plaintext = "";

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    if(tweet)
    plaintext += tweet.text + "\n\n"; // Now this will concatenate strings properly
  }

  return plaintext;
}

function LinkedinPostCard() {
  // const {setLinkedinPost,linkedinPost,sync,tweets,setSync } = useContext(PostContext)

  const { setLinkedinPost, linkedinPost, sync, tweets, setSync } = useStore(
    (state) => ({
      setLinkedinPost: state.setLinkedinPost,
      linkedinPost: state.linkedinPost,
      sync: state.sync,
      tweets: state.tweets,
      setSync: state.setSync,
    }),
    shallow
  );

  useEffect(() => {
    console.log("from linkedin component", convertTweetsToPlaintext(tweets));
    if (sync) {
      const newLinkedinContent = convertTweetsToPlaintext(tweets);
      setLinkedinPost(newLinkedinContent);
    }
  }, [sync, tweets, setLinkedinPost]);

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
      <LinkedInPostCreation
        content={linkedinPost}
        onContentChange={setLinkedinPost}
        sync={sync}
      />
      <Switch
        label="Sync with Twitter"
        color="blue"
        defaultChecked={sync}
        onChange={(e) => setSync(e.target.checked)}
      />
      <div></div>
    </div>
  );
}

export default LinkedinPostCard;
