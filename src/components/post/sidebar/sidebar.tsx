import { Avatar, Switch, Tooltip } from "@material-tailwind/react";
import React, { useContext } from "react";
import Picker from "~/components/custom/datepicker/picker";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import ConnectedAccount from "./connections";
import { useStore } from "~/store/post-store";
import { shallow } from "zustand/shallow";
import { SocialType } from "~/types/post-types";
import Publish from "./publish";


const SocialIcon = ({ type }: { type: string }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

const SideBar = () => {

  console.log("mounting sidebar")
  // const { tweets, linkedinPost } = useContext(PostContext);
 

  // const {data} = api.user.fetchConnectedAccounts.useQuery()

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
        <Publish/>
        <span className="text-xl my-2">
          Publish Post
        </span>
        <div className="grid grid-cols-3 place-items-start">
          {/* {data?.map((item) => (
            <ConnectedAccount
              key={item.data.tokenId}
              name={item.data.name}
              icon={<SocialIcon type={item.type} />}
              profilePic={item.data.profile_image_url || "/user.png"}
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








export default SideBar;
