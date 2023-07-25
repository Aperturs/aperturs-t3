import { Avatar } from "@material-tailwind/react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-types";

interface IConnection {
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
  } else if (type === SocialType.Lens) {
    return <img src="/lens.svg" className="h-6 w-6" alt="lens"/>
  }
  else {
    return null; // Return null or a default icon for other types
  }
};

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
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
      setSelectedSocials([...selectedSocial, { type: type, id,}]);
    }
  }
  };

  return (
    <div
      className={`${isSelected?'opacity-100':'opacity-25' } cursor-pointer hover:scale-105 transition-all duration-200 ease-out  flex flex-col items-center justify-center`}
      onClick={handleClick}>
      <div className="relative mb-1">
        <Avatar
          src={profilePic}
          alt="avatar"
          withBorder={true}
          className="p-0.5 ring-4 ring-indigo-300 border border-transparent "
        />
        <div className=" absolute bottom-0 left-[-15px] flex h-8 w-8 items-center justify-center rounded-full bg-neutral shadow-md ">
         <SocialIcon type={type}/>
        </div>
      </div>
      <p className="text-center break-words text-base font-light leading-5 ">{name}</p>
    </div>
  );
};

export default ConnectedAccount;
