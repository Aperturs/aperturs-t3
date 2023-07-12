import { Avatar, Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-types";

interface Iconnection {
  name: string;
  type: SocialType;
  profilePic?: string;
  id: number;
}

const SocialIcon = ({ type }: { type: string }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

const ConnectedAccount = ({ name, type, profilePic, id }: Iconnection) => {
  // const [selected, setSelected] = useState([{ type: "twitter", id: 0 }]);
  const {setSelectedSocials,selectedSocial} = useStore(state => ({
    setSelectedSocials: state.setSelectedSocials,
    selectedSocial: state.selectedSocials
  }), shallow);

  const isSelected = selectedSocial?.some((item) => item.id === id);

  const handleClick = () => {
    if(selectedSocial){
    if (isSelected) {
      setSelectedSocials(selectedSocial.filter((item) => item.id !== id));
    } else {
      setSelectedSocials([...selectedSocial, { type: type, id }]);
    }
  }
  };

  return (
    <div
      className={`${isSelected?'opacity-100':'opacity-25' } cursor-pointer hover:scale-105 transition-all duration-200 ease-out  flex flex-col items-center justify-center`}
      onClick={handleClick}>
      <div className="relative">
        <Avatar
          src={profilePic}
          alt="avatar"
          withBorder={true}
          className="p-0.5"
        />
        <div className="buttom-0 absolute bottom-0 left-[-15px] flex h-8 w-8 items-center justify-center rounded-full bg-neutral shadow-md ">
         <SocialIcon type={type}/>
        </div>
      </div>
      <p className="text-center  break-words text-base font-light leading-5 ">{name}</p>
    </div>
  );
};

export default ConnectedAccount;
