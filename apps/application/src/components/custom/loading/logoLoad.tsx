"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

const LogoLoad = ({ size }: { size?: string }) => {
  const { theme } = useTheme();
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center overflow-hidden">
      <div className={`${size ? `w-${size} h-${size}` : "h-24 w-24"}`}>
        {theme === "light" ? (
          <object type="image/svg+xml" data="/loader.svg" aria-label="logo" />
        ) : (
          <Image
            src="/gifload.gif"
            alt="Logo"
            objectFit="contain"
            objectPosition="center"
            unoptimized
            height={size ? parseInt(size) * 4 : 96}
            width={size ? parseInt(size) * 4 : 96}
          />
        )}
      </div>
    </div>
  );
};

export default LogoLoad;
