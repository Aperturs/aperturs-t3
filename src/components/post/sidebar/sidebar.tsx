import { Avatar, Switch, Tooltip } from "@material-tailwind/react";
import React, { useContext } from "react";
import Picker from "~/components/custom/datepicker/picker";
import { PostContext } from "../postWrapper";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import ConnectedAccount from "./connections";


const SocialIcon = ({ type }: { type: string }) => {
  if (type === 'twitter') {
    return <AiOutlineTwitter className="" />;
  } else if (type === 'linkedin') {
    return <FaLinkedinIn className="text-2xl" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

const SideBar = () => {
  const { tweets, linkedinPost } = useContext(PostContext);

  const handlePublish = () => {
    console.log("tweets", tweets);
    console.log("linkedinPost", linkedinPost);
    let tweetss = "";
    for (let i = 0; i < tweets.length; i++) {
      let tweetid = tweets[i]?.id;
      let tweettext = tweets[i]?.text;
      tweetss += `id: ${tweetid} text: ${tweettext} \n`;
    }
    toast(`tweets: ${tweetss} \n linkedinPost: ${linkedinPost}`);
  };

  const {data} = api.user.fetchConnectedAccounts.useQuery()

  return (
    <div className="z-20 w-full px-8 rounded-lg bg-white p-4 shadow-xl  shadow-blue-gray-900/5 lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">
      {/* <Switch
          label="Auto Sync"
          color="blue"
          defaultChecked={sync}
          onChange={(e)=>setSync(e.target.checked)}
          /> */}
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <h2 className="text-xl">Schedule Post</h2>
        <div className="flex w-full flex-grow gap-1">
          <Picker />
          <SimpleButton text="Schedule Post" onClick={() => {}} />
        </div>
        <SimpleButton text="Publish Now" onClick={handlePublish} />
        <SimpleButton text="Save" onClick={() => {}} />
        <SimpleButton text="Add to Queue" onClick={() => {}} />
        <span className="text-xl my-2">
          Publish Post
        </span>
        <div className="grid grid-cols-3 ">
          {/* {data?.map((item) => (
            <ConnectedAccount
              key={item.data.tokenId}
              name={item.data.name}
              icon={<SocialIcon type={item.type} />}
              profilePic={item.data.profile_image_url}
              id={item.data.tokenId}
            />
          ))} */}
          <ConnectedAccount
              
              name="Swaraj Bachu"
              icon={<SocialIcon type={"twitter"} />}
              profilePic="/user.png"
              id={2}
            />
          
        </div>
      </div>
    </div>
  );
};


interface SimpleButtonProps {
  text: string;
  onClick: () => void;
}

const SimpleButton = ({ text, onClick }: SimpleButtonProps) => {
  return (
    <button
      className="btn-outline btn-primary btn px-4 text-sm capitalize text-white "
      onClick={onClick}
    >
      {text}
    </button>
  );
};




export default SideBar;
