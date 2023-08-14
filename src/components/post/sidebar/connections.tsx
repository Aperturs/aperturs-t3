import { Avatar } from "@material-tailwind/react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

interface IConnection {
  name: string;
  type: string;
  profilePic?: string;
  id: number;
}

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
  // const [selected, setSelected] = useState([{ type: "twitter", id: 0 }]);
  const { setSelectedSocials, selectedSocial } = useStore(
    (state) => ({
      setSelectedSocials: state.setSelectedSocials,
      selectedSocial: state.selectedSocials,
    }),
    shallow
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const isSelected = selectedSocial?.some((item) => item.id === id);

  const handleClick = () => {
    if (selectedSocial) {
      if (isSelected) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setSelectedSocials(selectedSocial.filter((item) => item.id !== id));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setSelectedSocials([...selectedSocial, { type: type, id, name }]);
      }
    }
  };

  return (
    <div
      className={`${
        isSelected ? "opacity-100" : "opacity-25"
      } flex cursor-pointer flex-col items-center justify-center  transition-all duration-200 ease-out hover:scale-105`}
      onClick={handleClick}
    >
      <div className="relative mb-1">
        <Avatar
          src={profilePic}
          alt="avatar"
          withBorder={true}
          className="border border-transparent p-0.5 ring-4 ring-indigo-300 "
        />
        <div className=" absolute bottom-0 left-[-15px] flex h-8 w-8 items-center justify-center rounded-full bg-neutral shadow-md ">
          <SocialIcon type={type} />
        </div>
      </div>
      <p className="break-words text-center text-base font-light leading-5 ">
        {name}
      </p>
    </div>
  );
};

export default ConnectedAccount;
