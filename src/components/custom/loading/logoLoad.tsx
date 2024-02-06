"use client";

import { useTheme } from "next-themes";

const LogoLoad = ({ size }: { size?: string }) => {
  const { theme } = useTheme();
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center overflow-hidden">
      <div className={`${size ? `w-${size} h-${size}` : "h-24 w-24"}`}>
        <object
          type="image/svg+xml"
          data={theme === "dark" ? "/logoloadwithbg.svg" : "/loader.svg"}
        />
      </div>
    </div>
  );
};

export default LogoLoad;
