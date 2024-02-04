import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { type ButtonHTMLAttributes } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { SocialType } from "~/types/post-enums";
import { Button } from "../ui/button";

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
    <Button
      {...buttonProps}
      disabled={isLoading || buttonProps.disabled}
      className="py-4 font-normal"
    >
      {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  );
};
export const SocialIcon = ({ type }: { type: string }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="h-3 w-3" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="h-3 w-3" />;
  } else if (type === SocialType.Lens) {
    return <Image src="/lens.svg" width={30} height={30} alt="lens" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};
