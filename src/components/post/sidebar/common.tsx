interface SimpleButtonProps {
    text: string;
    onClick: () => void;
    isLoading?: boolean;
  }
  

export const SimpleButton = ({ text, onClick,isLoading }: SimpleButtonProps) => {
    return (
      <button
        className={`btn-outline w-full btn-primary btn px-4 text-sm capitalize text-white ${isLoading && 'loading'} `}
        onClick={onClick}
        disabled={isLoading}
      >
        {text}
      </button>
    );
  };