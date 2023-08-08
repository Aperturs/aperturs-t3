import Image from "next/image";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { SocialType } from "~/types/post-enums";

interface SimpleButtonProps {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
}

export const SimpleButton = ({
  text,
  onClick,
  isLoading,
}: SimpleButtonProps) => {
  return (
    <button
      className={`btn-outline btn-primary btn w-full px-4 text-sm capitalize text-white ${
        isLoading ? "loading" : ""
      } `}
      onClick={onClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
};
export const SocialIcon = ({ type }: { type: string }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="" />;
  } else if (type === SocialType.Lens) {
    return <Image src="/lens.svg" width={30} height={30} alt="lens" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};
