import { Avatar, Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";

interface Iconnection {
  name: string;
  icon: React.ReactNode;
  profilePic?: string;
  id: number;
}

const ConnectedAccount = ({ name, icon, profilePic, id }: Iconnection) => {
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
      setSelectedSocials([...selectedSocial, { type: "twitter", id }]);
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
          {icon}
        </div>
      </div>
      <p className="text-center  break-words text-base font-light leading-5 ">{name}</p>
    </div>
  );
};

export default ConnectedAccount;
