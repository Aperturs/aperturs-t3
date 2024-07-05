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
      console.log(content, "content select social");
      if (postType === "LONG_VIDEO") {
        setYoutubeContent({
          ...youtubeContent,
          name: name,
          youtubeId: id,
        });
        const existingYoutubeContentIndex = content.findIndex(
          (item) => item.socialType === "YOUTUBE",
        );
        console.log(existingYoutubeContentIndex, "existing index");

        if (existingYoutubeContentIndex !== -1) {
          // If there's existing youtube content, update it
          const updatedContent = content.map((item, index) => {
            if (index === existingYoutubeContentIndex) {
              return {
                ...item,
                name: name,
                id: id,
              };
            }
            return item;
          });
          console.log(updatedContent, "update");
          setContent(updatedContent);
        } else {
          // If there's no existing youtube content, add new content

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
        }
      } else {
        console.log("hello");
        const defaultContent = content.find((item) => item.id === "DEFAULT");
        const newContent = [
          ...content,
          {
            socialType: type,
            id,
            name,
            unique: false,
            content: defaultContent?.content ?? "",
            files: defaultContent?.files ?? [],
            uploadedFiles: defaultContent?.uploadedFiles ?? [],
            previewUrls: defaultContent?.previewUrls ?? [],
          },
        ];
        console.log(newContent, "new content from connection");
        setContent(newContent);
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
