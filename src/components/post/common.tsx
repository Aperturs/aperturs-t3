import Image from "next/image";
import { type ButtonHTMLAttributes } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { SocialType } from "~/types/post-enums";

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
}

export const SimpleButton = ({
  text,
  isLoading,
  ...buttonProps
}: SimpleButtonProps) => {
  return (
    <button
      className={`btn-outline btn-primary btn w-full px-4 text-sm capitalize text-white ${
        isLoading ? "loading" : ""
      } `}
      {...buttonProps}
      disabled={isLoading || buttonProps.disabled}
    >
      {text}
    </button>
  );
};
export const SocialIcon = ({ type }: { type: string }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="h-4 w-4" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="h-4 w-4" />;
  } else if (type === SocialType.Lens) {
    return <Image src="/lens.svg" width={30} height={30} alt="lens" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};
