import { Avatar } from "@material-tailwind/react";
import { shallow } from "zustand/shallow";
import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

interface IConnection {
  name: string;
  type: string;
  profilePic?: string;
  id: string;
}

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
  const { setContent, content, defaultContent } = useStore(
    (state) => ({
      setContent: state.setContent,
      content: state.content,
      defaultContent: state.defaultContent,
    }),
    shallow
  );
  console.log(content);

  const isSelected = content.some((item) => item.id === id);

  const handleClick = () => {
    if (isSelected) {
      setContent(content.filter((item) => item.id !== id));
    } else {
      setContent([
        ...content,
        { socialType: type, id, name, unique: false, content: defaultContent },
      ]);
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
        <div className=" bg-neutral absolute bottom-0 left-[-15px] flex h-8 w-8 items-center justify-center rounded-full shadow-md ">
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
