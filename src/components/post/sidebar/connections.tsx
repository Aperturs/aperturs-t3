import { Avatar, Tooltip } from "@material-tailwind/react";
import { useState } from "react";

interface Iconnection {
  name: string;
  icon: React.ReactNode;
  profilePic?: string;
  id: number;
}

const ConnectedAccount = ({ name, icon, profilePic, id }: Iconnection) => {
  const [selected, setSelected] = useState([{ type: "twitter", id: 0 }]);

  const isSelected = selected.some((item) => item.id === id);

  const handleClick = () => {
    if (isSelected) {
      setSelected(selected.filter((item) => item.id !== id));
    } else {
      setSelected([...selected, { type: "twitter", id }]);
    }
  };

  return (
    <div
      className={`${isSelected?'opacity-100':'opacity-25' } hover:scale-105 transition-all duration-200 ease-out  flex flex-col items-center justify-center`}
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
      <p className="text-center  text-sm">{name}</p>
    </div>
  );
};

export default ConnectedAccount;
