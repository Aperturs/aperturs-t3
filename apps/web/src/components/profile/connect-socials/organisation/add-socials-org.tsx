"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

import { Button } from "@aperturs/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@aperturs/ui/dialog";
import { SocialType } from "@aperturs/validators/post";

import { api } from "~/trpc/react";
import { handleLinkedinRedirect } from "../handle-socials";

export const SocialIcon = ({ type }: { type: SocialType }) => {
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

export const AddSocialOrg = () => {
  return (
    <Dialog>
      <DialogTrigger className="">
        <Button className="h-20 w-full  whitespace-nowrap">
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
  } = api.linkedin.addLinkedln.useMutation();
  const {
    mutateAsync: addGithub,
    data: githubData,
    isPending: githubLoading,
  } = api.github.addGithub.useMutation();

  const params = useParams<{ orgid: string }>();

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
          if (params?.orgid) {
            await handleLinkedinRedirect({
              orgId: params.orgid,
            });
          } else {
            toast.error("Org id not found");
          }
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
