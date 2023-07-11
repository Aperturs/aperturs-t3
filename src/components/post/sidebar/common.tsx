interface SimpleButtonProps {
    text: string;
    onClick: () => void;
  }
  

export const SimpleButton = ({ text, onClick }: SimpleButtonProps) => {
    return (
      <button
        className="btn-outline w-auto btn-primary btn px-4 text-sm capitalize text-white "
        onClick={onClick}
      >
        {text}
      </button>
    );
  };