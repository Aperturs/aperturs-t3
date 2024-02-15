"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

const LogoLoad = ({ size }: { size?: string }) => {
  const { theme } = useTheme();
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center overflow-hidden">
      <div className={`${size ? `w-${size} h-${size}` : "h-24 w-24"}`}>
        {theme === "light" ? (
          <object type="image/svg+xml" data="/loader.svg" />
        ) : (
          <Image
            src="/gifload.gif"
            alt="Logo"
            objectFit="contain"
            objectPosition="center"
            height={size ? parseInt(size) * 4 : 96}
            width={size ? parseInt(size) * 4 : 96}
          />
        )}
      </div>
    </div>
  );
};

export default LogoLoad;
