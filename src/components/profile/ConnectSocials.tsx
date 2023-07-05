import React, { useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaFacebookSquare, FaLinkedinIn } from "react-icons/fa";
import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { api } from "~/utils/api";
import { onLinkedLnConnect } from "~/utils/connections";


const SocialIcon = ({ type }: { type: string }) => {
  if (type === 'twitter') {
    return <AiOutlineTwitter className="text-2xl" />;
  } else if (type === 'linkedin') {
    return <FaLinkedinIn className="text-2xl" />;
  } else {
    return null; // Return null or a default icon for other types
  }
};



const ConnectSocials = () => {

  const {data} = api.user.fetchConnectedAccounts.useQuery()
  
  return (
    <Card className="h-[50vh] w-[95%] rounded-xl p-6">
      {/* <h1 className='text-5xl font-medium text-gray-600'>Connect Socials</h1> */}
      <div className="mt-4 flex flex-col">
        <h2 className="text-3xl font-bold">Connect your socials</h2>
        <div className="grid gap-4 grid-cols-4">
          <div className="mt-4 flex gap-4">
            {data &&
              data.map((item) => (
                <AfterConnect
                  name={item.data.name || ''}
                  icon={<SocialIcon type={item.type} />}
                  profilePic={item.data.profile_image_url || ''}
                />
              ))}
            <AfterConnect
              name="Swaraj"
              icon={<FaFacebookSquare />}
              profilePic="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            />
            <AddSocial />
          </div>
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
        className="btn-primary w-full btn h-full text-white"
      >
        <div className="flex justify-center gap-3 items-center h-full w-full whitespace-nowrap	">
          <IoIosAddCircle className="text-2xl" />
          Add Socials
        </div>
      </label>

      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn-sm btn-circle btn absolute right-2 top-2"
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
  const router = useRouter();

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
        <button className="btn gap-2 hover:border-0 hover:bg-primary  hover:text-white"
          onClick={() => {
            onLinkedLnConnect()
          }}
        >
          <FaLinkedinIn className="text-2xl " />
          <p>Linkedin</p>
        </button>
        <button className="btn gap-2 hover:border-0 hover:bg-[#AAFE2C]  hover:text-black">
          <img src="/lens.svg" className="h-6 w-6" />
          <p>Lens </p>
        </button>
    </div>
  );
};

interface Iconnection {
  name: string;
  icon: React.ReactNode;
  profilePic?: string;
}

const AfterConnect = ({ name, icon, profilePic }: Iconnection) => {
  return (
    <div className="flex items-center w-full justify-center rounded-lg px-10 py-6 shadow-md">
      <img className="h-10 w-10 rounded-full object-cover" src={profilePic} />
      <div className="my-2 mx-2 flex w-full flex-col items-center">
        <h2 className="text-sm whitespace-nowrap leading-3 ">{name}</h2>
      </div>
      <div className="flex w-full justify-center text-3xl text-black">
        {icon}
      </div>
    </div>
  );
};

export default ConnectSocials;
