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

const getRingColor = (type: SocialType) => {
  switch (type) {
    case "FACEBOOK":
      return "ring-blue-600 dark:ring-blue-400";
    case "TWITTER":
      return "ring-blue-400 dark:ring-blue-600";
    case "INSTAGRAM":
      return "ring-ping-500 dark:ring-ping-400";
    case "LINKEDIN":
      return "ring-blue-500 dark:ring-blue-500";
    case "YOUTUBE":
      return "ring-red-500 dark:ring-red-400";
    default:
      return "ring-primary";
  }
};

const ConnectedAccount = ({ name, type, profilePic, id }: IConnection) => {
  const { setPost, post } = useStore(
    (state) => ({
      setPost: state.setPost,
      post: state.post,
    }),
    shallow,
  );

  const isSelected = post.socialProviders.some((item) => item.socialId === id);

  const handleClick = () => {
    if (isSelected) {
      setPost({
        ...post,
        socialProviders: post.socialProviders.filter(
          (item) => item.socialId !== id,
        ),
      });
    } else {
      setPost({
        ...post,
        socialProviders: [
          ...post.socialProviders,
          {
            socialId: id,
            name: name,
            socialType: type,
          },
        ],
      });
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
        <Avatar className={`p-0.5 ring-4 ${getRingColor(type)}  ring-offset-1`}>
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
