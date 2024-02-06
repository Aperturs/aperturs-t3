import { AvatarImage } from "@radix-ui/react-avatar";
import { shallow } from "zustand/shallow";
import { Avatar } from "~/components/ui/avatar";
import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

interface IConnection {
  name: string;
  type: string;
  profilePic?: string;
  id: string;
}

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
  const { setContent, content } = useStore(
    (state) => ({
      setContent: state.setContent,
      content: state.content,
    }),
    shallow
  );

  const isSelected = content.some((item) => item.id === id);

  const handleClick = () => {
    if (isSelected) {
      setContent(content.filter((item) => item.id !== id));
    } else {
      setContent([
        ...content,
        {
          socialType: type,
          id,
          name,
          unique: false,
          content: content[0]?.content || "",
          files: [],
          uploadedFiles: [],
        },
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
      <div className="relative">
        {/* <Avatar
          src={profilePic}
          alt="avatar"
          withBorder={true}
        /> */}
        <Avatar className="p-0.5 ring-4 ring-primary ring-offset-1">
          <AvatarImage src={profilePic} alt="avatar" className=" " />
        </Avatar>
        <div className="absolute bottom-0 left-[-15px] flex h-6 w-6 items-center justify-center rounded-full bg-card  shadow-md ">
          <SocialIcon type={type} />
        </div>
      </div>
      <p className="mt-2 break-words text-center text-sm font-light leading-5">
        {name}
      </p>
    </div>
  );
};

export default ConnectedAccount;
