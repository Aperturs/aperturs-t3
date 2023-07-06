import { createContext, useState } from "react";
import SocialTabs from "./tabs/socialtabs";
import Picker from "../custom/datepicker/picker";
import { Switch } from "@material-tailwind/react";
import { toast } from "react-hot-toast";
import SideBar from "./sidebar/sidebar";

type Tweet = {
  id: number;
  text: string;
};

export const PostContext = createContext({
  linkedinPost: "",
  tweets: [
    {
      id: 1,
      text: "",
    },
  ],
  setLinkedinPost: (content: string) => {},
  setTweets: (tweet: Tweet[]) => {},
  sync: false,
  setSync: (sync: boolean) => {},
  date: new Date(),
  setDate: (date: Date) => {},
  time: new Date().getTime(),
  setTime: (time: number) => {},
});

function PostView() {
  const [linkedinPost, setLinkedinPost] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([
    { id: 0,text: " " },
    // { id: 0, content: "Hello World" },
    // { id: 1, content: "Hello React" },
  ]);
  const [sync, setSync] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date().getTime());

  const handlePublish = () => {
    console.log("tweets", tweets);
    console.log("linkedinPost", linkedinPost);
    let tweetss = ""
    for(let i=0;i<tweets.length;i++){
      let tweetid = tweets[i]?.id
      let tweettext = tweets[i]?.text
      tweetss += `id: ${tweetid} text: ${tweettext} \n`
    }
    toast(`tweets: ${tweetss} \n linkedinPost: ${linkedinPost}`)
  }
  return (
    <PostContext.Provider
      value={{
        linkedinPost,
        tweets,
        setLinkedinPost,
        setTweets,
        sync,
        setSync,
        date,
        setDate,
        time,
        setTime,
      }}
    >
      <div className="flex  gap-5 justify-center">
        <SocialTabs />
        <div className="lg:max-w-[18rem] mt-[-6rem] w-full">
        <SideBar />
        </div>
      </div>
    </PostContext.Provider>
  );
}






export default PostView;
