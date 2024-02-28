import Image from "next/image";

import type { SocialType } from "@aperturs/validators/post";
import { Card } from "@aperturs/ui/components/ui/card";

import ConnectSocialsAction from "./connect-social-actions";

export interface IConnection {
  name: string;
  icon: React.ReactNode;
  profilePic: string;
  id: string;
  type: SocialType;
}

export const ConnectedSocial = ({
  name,
  icon,
  profilePic,
  id,
  type,
}: IConnection) => {
  return (
    <Card className="flex w-full items-center justify-between gap-3  px-10 py-6 ">
      <Image
        className="mx-2 h-10 w-10 rounded-full object-cover"
        src={profilePic}
        alt="profile"
        width={40}
        height={40}
      />
      <h2 className="whitespace-nowrap text-sm leading-3 ">{name}</h2>
      {icon}
      <ConnectSocialsAction id={id} type={type} />
    </Card>
  );
};
