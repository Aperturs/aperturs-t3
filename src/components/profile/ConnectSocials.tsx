import { useAuth } from "@clerk/nextjs";
import { Card, Spinner } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { SocialType } from "~/types/post-enums";
import { api } from "~/utils/api";

const SocialIcon = ({ type }: { type: string }) => {
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
            <Spinner className="h-8 w-8 text-blue-500/10" />
          ) : (
            data &&
            data.map((item, key) => (
              <AfterConnect
                key={key}
                name={item.data.name || ""}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                icon={<SocialIcon type={item.type} />}
                profilePic={item.data.profile_image_url || "/user.png"}
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
    <div>
      <label
        htmlFor="my-modal-3"
        className="btn btn-primary h-full w-full text-white shadow-md"
      >
        <div className="flex h-full w-full items-center justify-center gap-3 whitespace-nowrap py-6	">
          <IoIosAddCircle className="text-2xl" />
          Add Socials
        </div>
      </label>

      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-circle btn-sm absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Socials to Aperturs</h3>
          <Socials />
        </div>
      </div>
    </div>
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
      <button
        className="btn gap-2 hover:border-0 hover:bg-primary  hover:text-white"
        onClick={() => router.push("/socials/twitter")}
      >
        <AiOutlineTwitter className="text-2xl " />
        <p>Twitter</p>
      </button>
      {/* <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <AiFillInstagram className="text-2xl " />
        <p>Insta</p>
      </button> */}
      <button
        className="btn gap-2 hover:border-0 hover:bg-primary  hover:text-white"
        onClick={async () => {
          if (userId) await handleLinkedln();
        }}
        disabled={localLoading}
      >
        <FaLinkedinIn className="text-2xl " />
        <p>Linkedin</p>
      </button>
      {/* <button
        className="btn gap-2 hover:border-0 hover:bg-[#DACCF3]  hover:text-black"
        onClick={() => router.push("/socials/lens")}
      >
        <Image src="/lens.svg" alt="lens" width={40} height={40} />
        <p>Lens </p>
      </button> */}
      <button
        className={`btn gap-2 hover:border-0 hover:bg-primary  hover:text-white `}
        onClick={async () => {
          if (userId) await handleGithub();
        }}
        disabled={githubLoading || localLoading}
      >
        <FaGithub className="text-2xl " />
        <p>Github </p>
      </button>
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
    <div className="flex w-full items-center justify-center rounded-lg px-10 py-6 shadow-md">
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
    </div>
  );
};

export default ConnectSocials;
