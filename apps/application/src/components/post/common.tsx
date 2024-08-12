import type { ButtonHTMLAttributes } from "react";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AiFillYoutube, AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { shallow } from "zustand/shallow";

import type {
  FullPostType,
  PostType,
  SocialType,
} from "@aperturs/validators/post";
import { Button } from "@aperturs/ui/button";
import { cn } from "@aperturs/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@aperturs/ui/select";
import { postType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SimpleButton = ({
  text,
  isLoading,
  disabled,
  ...buttonProps
}: SimpleButtonProps) => {
  return (
    <Button
      variant="secondary"
      {...buttonProps}
      disabled={disabled}
      className="py-6 font-normal"
    >
      {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
};

interface SocialIconProps {
  type: SocialType;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

export const SocialIcon = ({ type, className, size }: SocialIconProps) => {
  const sizeClass = size ? sizeClasses[size] : "";

  if (type === "TWITTER") {
    return <AiOutlineTwitter className={cn("h-3 w-3", className, sizeClass)} />;
  } else if (type === "LINKEDIN") {
    return <FaLinkedinIn className={cn("h-3 w-3", className, sizeClass)} />;
  } else if (type === "YOUTUBE") {
    return <AiFillYoutube className={cn("h-3 w-3", className, sizeClass)} />;
  } else if (type === "LENS") {
    return <Image src="/lens.svg" width={30} height={30} alt="lens" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

export function PostTypeSelect() {
  const { statePosttype, setPostType } = useStore(
    (state) => ({
      statePosttype: state.postType,
      setPostType: state.setPostType,
    }),
    shallow,
  );

  return (
    <Select
      defaultValue={statePosttype}
      value={statePosttype}
      onValueChange={(value) => setPostType(value as PostType)}
    >
      <div className="flex items-center">
        <p className="my-0 ml-1 text-sm text-muted-foreground">Post Type</p>
      </div>
      <SelectTrigger className="mx-0 mb-2 w-full">
        <SelectValue placeholder="Select a PostType" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Post Type</SelectLabel>
          <SelectItem value={postType.normal}>Regular Post</SelectItem>
          {/* <SelectItem value={postType.short}>Short Video</SelectItem> */}
          <SelectItem value={postType.longVideo}>Long Videos</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
