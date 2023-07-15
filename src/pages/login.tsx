import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";

const Login = () => {  
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">Aperturs</h1>
          <p className="text-white mt-1">
            One Stop Social Media Management Software
          </p>
          <button
            type= "submit"
            onClick= {() => { window.location.href = "/"; }}
            className= "block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">
            Read More
          </button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <SignIn path="/login" signUpUrl="/signup" afterSignInUrl="/dashboard" />
      </div>
    </div>
  );
};

export default Login;
