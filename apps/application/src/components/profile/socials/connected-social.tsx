import Image from "next/image";

import type { SocialType } from "@aperturs/validators/post";
import { Card } from "@aperturs/ui/card";

import ConnectSocialsAction from "./connect-social-actions";

export interface IConnection {
  name: string;
  icon: React.ReactNode;
  profilePic: string;
  id: string;
  type: SocialType;
  username?: string;
  connectedAt?: Date;
}

export const ConnectedSocial = ({
  name,
  icon,
  profilePic,
  id,
  type,
  username,
  connectedAt,
}: IConnection) => {
  return (
    <Card className="relative flex w-full flex-col items-center justify-between gap-3  px-10 py-6 ">
      <Image
        className="mx-2 h-10 w-10 rounded-full object-cover"
        src={profilePic}
        alt="profile"
        width={40}
        height={40}
      />
      <h2 className="break-words text-center text-sm leading-6 ">{name}</h2>
      <p className="text-xs text-gray-500">{username}</p>
      {/* <div className="h-0.5 w-full bg-gray-200" /> */}
      <div className="absolute right-10 top-4">{icon}</div>
      <ConnectSocialsAction id={id} type={type} />
      <p className="text-center text-xs font-bold text-gray-500">
        Connected on <span>{connectedAt?.toDateString()}</span>
      </p>
    </Card>
  );
};
