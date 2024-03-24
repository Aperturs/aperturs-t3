import { shallow } from "zustand/shallow";

import type { SocialType } from "@aperturs/validators/post";
import { Avatar, AvatarFallback, AvatarImage } from "@aperturs/ui/avatar";

import { useStore } from "~/store/post-store";
import { SocialIcon } from "../common";

interface IConnection {
  name: string;
  type: SocialType;
  profilePic?: string;
  id: string;
}

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
  const { setContent, content, setYoutubeContent, postType, youtubeContent } =
    useStore(
      (state) => ({
        setContent: state.setContent,
        content: state.content,
        setYoutubeContent: state.setYoutubeContent,
        postType: state.postType,
        youtubeContent: state.youtubeContent,
      }),
      shallow,
    );

  const isSelected =
    content.some((item) => item.id === id) || youtubeContent.youtubeId === id;

  const handleClick = () => {
    if (isSelected) {
      setContent(content.filter((item) => item.id !== id));

      if (postType === "LONG_VIDEO") {
        setYoutubeContent({
          ...youtubeContent,
          name: "",
          youtubeId: "",
        });
      }
    } else {
      setContent([
        ...content,
        {
          socialType: type,
          id,
          name,
          unique: false,
          content: content[0]?.content ?? "",
          files: [],
          uploadedFiles: [],
        },
      ]);
      if (postType === "LONG_VIDEO") {
        setYoutubeContent({
          ...youtubeContent,
          name: name,
          youtubeId: id,
        });
      }
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`${
        isSelected ? "opacity-100" : "opacity-25"
      } flex cursor-pointer flex-col items-center justify-center  transition-all
      duration-200 ease-out hover:scale-105`}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar className="p-0.5 ring-4 ring-primary ring-offset-1">
          <AvatarImage src={profilePic} alt="avatar" />
          <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
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
