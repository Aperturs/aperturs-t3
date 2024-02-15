"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

import { SocialType } from "~/types/post-enums";
import { api } from "~/utils/api";
import SimpleLoader from "../custom/loading/simple-loading";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const SocialIcon = ({ type }: { type: SocialType }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="text-2xl" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="text-2xl" />;
  } else if (type === SocialType.Github) {
    return <FaGithub className="text-2xl" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

const ConnectSocials = () => {
  const { data, isLoading } = api.user.fetchConnectedAccounts.useQuery();

  return (
    <Card className="min-h-[50vh] w-full rounded-xl p-6">
      {/* <h1 className='text-5xl font-medium text-gray-600'>Connect Socials</h1> */}
      <div className="mt-4 flex flex-col">
        <h2 className="mb-6 text-xl font-bold md:text-3xl">
          Connect your socials
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {isLoading ? (
            <SimpleLoader />
          ) : (
            data?.map((item, key) => (
              <AfterConnect
                key={key}
                name={item.data.name ?? ""}
                icon={<SocialIcon type={item.type} />}
                profilePic={item.data.profile_image_url ?? "/user.png"}
              />
            ))
          )}
          <AddSocial />
        </div>
      </div>
    </Card>
  );
};

const AddSocial = () => {
  return (
    <Dialog>
      <DialogTrigger className="">
        <Button className="h-full w-full  whitespace-nowrap">
          <IoIosAddCircle className="text-2xl" />
          Add Socials
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-bold">Add Socials to Aperturs</h2>
        <Socials />
      </DialogContent>
    </Dialog>
  );
};

const Socials = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  const {
    mutateAsync: addLinkedln,
    data: linkedlnData,
    error,
  } = api.user.addLinkedln.useMutation();
  const {
    mutateAsync: addGithub,
    data: githubData,
    isLoading: githubLoading,
  } = api.user.addGithub.useMutation();

  const handleLinkedln = async () => {
    setLocalLoading(true);
    await addLinkedln();
    if (linkedlnData) {
      window.location.href = linkedlnData.url;
    }
    if (error) {
      toast.error(error.message);
    }
    setLocalLoading(false);
  };
  const handleGithub = async () => {
    setLocalLoading(true);
    await addGithub();
    if (githubData) {
      window.location.href = githubData.url;
    }
    if (error) {
      toast.error(error.message);
    }
    setLocalLoading(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      {/* <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <FaFacebookSquare className="text-2xl " />
        <p>Facebook</p>
      </button> */}
      <Button
        variant="secondary"
        className="h-12"
        onClick={() => router.push("/socials/twitter")}
      >
        <AiOutlineTwitter className="mr-2 text-2xl " />
        <p>Twitter</p>
      </Button>
      {/* <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <AiFillInstagram className="text-2xl " />
        <p>Insta</p>
      </button> */}
      <Button
        variant="secondary"
        className="h-12"
        onClick={async () => {
          if (userId) await handleLinkedln();
        }}
        disabled={localLoading}
      >
        <FaLinkedinIn className="mr-2 text-2xl" />
        <p>Linkedin</p>
      </Button>
      {/* <button
        className="btn gap-2 hover:border-0 hover:bg-[#DACCF3]  hover:text-black"
        onClick={() => router.push("/socials/lens")}
      >
        <Image src="/lens.svg" alt="lens" width={40} height={40} />
        <p>Lens </p>
      </button> */}
      <Button
        variant="secondary"
        className="h-12"
        onClick={async () => {
          if (userId) await handleGithub();
        }}
        disabled={githubLoading || localLoading}
      >
        <FaGithub className="mr-2 text-2xl" />
        <p>Github </p>
      </Button>
    </div>
  );
};

interface IConnection {
  name: string;
  icon: React.ReactNode;
  profilePic: string;
}

const AfterConnect = ({ name, icon, profilePic }: IConnection) => {
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

export default ConnectSocials;
