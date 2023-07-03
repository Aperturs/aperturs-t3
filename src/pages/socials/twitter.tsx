import Link from "next/link";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { api } from "~/utils/api";

const AddTwitter = () => {



  return (
    <div className="w-screen lg:px-56 md:px-24 px-10 py-28">
      <Link href={'/settings'} className="flex items-center space-x-2 my-2 text-sm text-gray-600 hover:text-gray-900">
        <IoIosArrowBack size={20} />
        <span>Back</span>
    </Link>
      <h1 className="text-4xl font-medium text-primary">Add Twitter</h1>
      <p className="mt-2 text-gray-500">
        you will need to give your own
        <span className="font-bold text-primary"> Twitter API keys </span>
      </p>
      <p className="text-gray-500">
        you can get them from Twitter Developer Portal
      </p>
      <ApiBox />
    </div>
  );
};

function ApiBox() {

  const {  data,mutateAsync,error,isLoading } = api.user.addTwitter.useMutation()

  console.log(error,'error')
  const [clientID, setClientID] = React.useState("UE05dTJ3ZjhjTnFESUQ5aTBIcFo6MTpjaQ");
  const [clientSecret, setClientSecret] = React.useState("NzEjJmLCdQud4JjTSw2QaLjFv6zXKQWtg51hrbrvgGgj6lezfs");

  const connectHandler = async () => {

    await mutateAsync({clientId:clientID,clientSecret:clientSecret}).then((data)=>
    {
    window.location.href = data
    })
  }

  return (
    <div className="postShadow mt-8 flex  w-full flex-col rounded-xl p-6">
      <h1 className="text-2xl font-medium text-primary">API Keys</h1>
      <p className="mt-2 text-gray-500">Client ID</p>
      <input
        className="my-2 h-auto w-full resize-none rounded-xl border border-primary p-3"
        placeholder="UE05dTJ45jhjTvdEUYQ5aTBIcFo6MTpjaQ"
        value={clientID}
        onChange={(e) => setClientID(e.target.value)}
      ></input>
      <p className="mt-2 text-gray-500">Client Secret</p>
      <input
        className="h-auto w-full resize-none rounded-xl  
      border border-primary p-3 "
        placeholder="NzEjJmLCdQud4JuKSw2QaLjFv4zSTQWtg31hRwrsdSfw3ayqfq"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
      ></input>

      <div className="alert alert-warning my-3 bg-orange-200 ">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
          <span className="font-bold">Bring your Own APIs</span>
          <span className="m-1">
            Due to Twitter new APIs rules, we are only allowing user who bring
            their own Api Keys
          </span>
          </div>
        </div>

      </div>

      <div className="w-full flex justify-end">
      <button className="btn btn-primary sm:w-56 w-24  text-white rounded-xl px-4 py-2 mt-4"
      onClick={connectHandler}
      disabled={isLoading}
      >
        Connect
      </button>
      </div>
      
    </div>
  );
}

export default AddTwitter;
