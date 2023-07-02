import React, { useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import {FaFacebookSquare,FaLinkedinIn} from 'react-icons/fa'
import {AiFillInstagram,AiOutlineTwitter,} from 'react-icons/ai'
import { useRouter } from "next/router";
import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { api } from "~/utils/api";

const ConnectSocials = () => {

  api.user.fetchConnectedAccounts.useQuery()
  const {data,isLoading,error} = api.user.fetchConnectedAccounts.useQuery()


  return (
    <Card className="h-[50vh] w-[95%] rounded-xl p-6">
      {/* <h1 className='text-5xl font-medium text-gray-600'>Connect Socials</h1> */}
      <div className="mt-4 flex flex-col">
        <h2 className="text-3xl font-bold">
          Connect your socials
        </h2>
        <div className="grid grid-cols-3 w-full">
        <div className="mt-4 flex gap-4">
          <AfterConnect 
          name="Swaraj"
          username="swaraj"
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
      <label htmlFor="my-modal-3" className="btn-primary btn gap-2  h-full flex-col w-full px-6 text-white">
        <IoIosAddCircle className="text-2xl" />
        Add Socials
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
          <h3 className="text-lg font-bold">
            Add Socials to Aperturs
          </h3>
          <Socials />
        </div>
      </div>
    </div>
  );
};



const Socials = () => {

  const router = useRouter()


  return (
    <div className="grid grid-cols-3 py-4 gap-4">
      {/* <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <FaFacebookSquare className="text-2xl " />
        <p>Facebook</p>
      </button> */}
      <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2"
      onClick={()=>router.push('/socials/twitter')}
      >
        <AiOutlineTwitter className="text-2xl " />
        <p>Twitter</p>
      </button>
      {/* <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <AiFillInstagram className="text-2xl " />
        <p>Insta</p>
      </button> */}
      <button className="btn hover:bg-primary hover:text-white hover:border-0  gap-2">
        <FaLinkedinIn className="text-2xl " />
        <p>Linkedin</p>
      </button>
      <button className="btn hover:bg-[#AAFE2C] hover:text-black hover:border-0  gap-2">
        <img src='/lens.svg' className="w-6 h-6"/>
        <p>Lens </p>
      </button>
    </div>
  )
}

interface Iconnection {
  name: string;
  username: string;
  icon: React.ReactNode;
  profilePic?: string;
}

const AfterConnect = ({name,username,icon,profilePic}:Iconnection) => {
  return(
    <div className="shadow-md flex-col justify-center items-center rounded-lg px-10 py-6">
      <div>
        <img className="rounded-full h-20 w-20 object-cover"
        src={profilePic}
        />
      </div>
      <div className="flex flex-col w-full items-center my-2">
        <h2 className="text-xl font-bold">{name}</h2>
        <h3 className="text-gray-500">@{username}</h3>
      </div>
      <div className="w-full flex justify-center text-black text-3xl">
      {icon}
      </div>
    </div>
  )
}

export default ConnectSocials;






