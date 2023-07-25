import { type FC, type MouseEventHandler } from "react";

interface SideBarButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const BasicButton: FC<SideBarButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="btn-primary btn ml-1 w-44 text-white">
      {text}
    </button>
  );
};

export default BasicButton;
