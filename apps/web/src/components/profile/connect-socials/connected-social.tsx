import Image from "next/image";

import { Card } from "@aperturs/ui/components/ui/card";

export interface IConnection {
  name: string;
  icon: React.ReactNode;
  profilePic: string;
}

export const ConnectedSocial = ({ name, icon, profilePic }: IConnection) => {
  return (
    <Card className="flex w-full items-center justify-center  px-10 py-6 ">
      <Image
        className="mx-2 h-10 w-10 rounded-full object-cover"
        src={profilePic}
        alt="profile"
        width={40}
        height={40}
      />
      <div className="mx-2 my-2 flex w-full flex-col items-center">
        <h2 className="whitespace-nowrap text-sm leading-3 ">{name}</h2>
      </div>
      <div className="flex w-full justify-center text-3xl text-black">
        {icon}
      </div>
    </Card>
  );
};
