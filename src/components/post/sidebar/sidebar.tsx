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
import useLensProfile from "~/hooks/lens-profile";




const SideBar = () => {

  console.log("mounting sidebar")
  // const { tweets, linkedinPost } = useContext(PostContext);
 

  const {data} = api.user.fetchConnectedAccounts.useQuery()
  const { profile:lensProfile, loading:lensLoading, error:lensError } = useLensProfile();


  return (
    <div className="z-20 w-full px-8 rounded-lg bg-white p-4 shadow-xl  shadow-blue-gray-900/5 lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">

      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <h2 className="text-xl">Schedule Post</h2>
        <Publish/>
        <span className="text-xl my-2">
          Publish Post
        </span>
        <div className="grid gap-3 grid-cols-3 place-items-start">
          {data?.map((item) => (
            <ConnectedAccount
              key={item.data.tokenId}
              name={item.data.name}
              type={item.type}
              profilePic={item.data.profile_image_url || "/user.png"}
              id={item.data.tokenId}
            />
          ))}
            <ConnectedAccount  
              name="Swaraj Bachu"
              type={SocialType.Twitter}
              profilePic="/user.png"
              id={2}
            />
             <ConnectedAccount
              id={0}
              name={lensProfile.name}
              type = {SocialType.Lens}
              profilePic={lensProfile.imageUrl}
            />
        </div>
      </div>
    </div>
  );
};








export default SideBar;
