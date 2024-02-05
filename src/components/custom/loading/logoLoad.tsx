const LogoLoad = ({ size }: { size?: string }) => {
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center overflow-hidden">
      <div className={`${size ? `w-${size} h-${size}` : "h-24 w-24"}`}>
        <object
          type="image/svg+xml"
          data="/loader.svg"
          // className="bg-transparent"
        />
      </div>
    </div>
  );
};

export default LogoLoad;
