"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AiFillYoutube, AiOutlineTwitter } from "react-icons/ai";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Button } from "@aperturs/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@aperturs/ui/dialog";
import { SocialAdd } from "@aperturs/ui/icons";
import { SocialType } from "@aperturs/validators/post";

import {
  handleInstagramRedirect,
  handleLinkedinRedirect,
  handleYoutubeRedirect,
} from "~/utils/actions/handle-socials";

export const SocialIcon = ({ type }: { type: SocialType }) => {
  if (type === SocialType.Twitter) {
    return <AiOutlineTwitter className="text-2xl dark:text-white" />;
  } else if (type === SocialType.Linkedin) {
    return <FaLinkedinIn className="text-2xl dark:text-white" />;
  } else if (type === SocialType.Github) {
    return <FaGithub className="text-2xl dark:text-white" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};

export const AddSocial = () => {
  return (
    <Dialog>
      <DialogTrigger className="">
        <Button
          className="flex h-full min-h-32  w-full gap-2 whitespace-nowrap"
          variant="secondary"
        >
          <SocialAdd />
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

  const params = useParams<{ orgid: string }>();

  // const handleGithub = async () => {
  //   setLocalLoading(true);
  //   if (!params?.orgid) {
  //     await handleGithubRedirect({
  //       orgId: "personal",
  //     });
  //     return;
  //   }
  //   await handleGithubRedirect({
  //     orgId: params?.orgid,
  //   });
  //   setLocalLoading(false);
  // };

  const handleLinkedln = async () => {
    setLocalLoading(true);
    if (!params?.orgid) {
      await handleLinkedinRedirect({
        orgId: "personal",
        tokenId: "new",
      });
      return;
    }
    await handleLinkedinRedirect({
      orgId: params.orgid,
      tokenId: "new",
    });
    setLocalLoading(false);
  };

  const handleInstagram = async () => {
    setLocalLoading(true);
    await handleInstagramRedirect({
      orgId: params?.orgid ?? "personal",
      tokenId: "new",
    });
    setLocalLoading(false);
  };

  const handleYoutube = async () => {
    setLocalLoading(true);
    await handleYoutubeRedirect({
      orgId: params?.orgid ?? "personal",
      tokenId: "new",
    });
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
        onClick={() =>
          router.push(
            `/socials/twitter?orgid=${params?.orgid ?? "personal&tokenid=new"}`,
          )
        }
        disabled={localLoading}
      >
        <AiOutlineTwitter className="mr-2 text-2xl " />
        <p>Twitter</p>
      </Button>
      {/* <Button
        variant="secondary"
        className="h-12"
        onClick={handleInstagram}
        disabled={localLoading}
      >
        <AiFillInstagram className="mr-2 text-2xl" />
        <p>Insta</p>
      </Button> */}
      {params.orgid && (
        <Button
          variant="secondary"
          className="h-12"
          onClick={handleYoutube}
          disabled={localLoading}
        >
          <AiFillYoutube className="mr-2 text-2xl" />
          <p>Youtube</p>
        </Button>
      )}
      <Button
        variant="secondary"
        className="h-12"
        onClick={handleLinkedln}
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
      {/* <Button
        variant="secondary"
        className="h-12"
        onClick={async () => {
          if (userId) await handleGithub();
        }}
        disabled={localLoading}
      >
        <FaGithub className="mr-2 text-2xl" />
        <p>Github </p>
      </Button> */}
    </div>
  );
};
