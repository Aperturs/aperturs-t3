import type { FC, MouseEventHandler } from "react";

interface SideBarButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const BasicButton: FC<SideBarButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="btn btn-primary ml-1 w-44 text-white">
      {text}
    </button>
  );
};

export default BasicButton;
