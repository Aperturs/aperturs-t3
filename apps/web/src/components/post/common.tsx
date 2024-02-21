import type { ButtonHTMLAttributes } from "react";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

import { Button } from "@aperturs/ui/button";
import { cn } from "@aperturs/ui/lib/utils";

import { SocialType } from "~/types/post-enums";

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
    <Button {...buttonProps} disabled={disabled} className="py-6 font-normal">
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

  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className={cn("h-3 w-3", className, sizeClass)} />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className={cn("h-3 w-3", className, sizeClass)} />;
  } else if (type === SocialType.Lens) {
    return <Image src="/lens.svg" width={30} height={30} alt="lens" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};
