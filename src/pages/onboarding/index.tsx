import React from "react";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";


export default function Example() {

    const router = useRouter()

  return (
    <div className="flex py-24 w-full items-center justify-center">
      <div className="w-full max-w-lg flex flex-col justify-center items-center">
        <img src="/logo.svg" className="max-w-sm" />
        <Typography className='my-4' variant="h2" color="indigo" textGradient>
          Welcome to Aperturs
        </Typography>
        <Typography className='text-center' variant="lead" color="gray">
        Aperturs gives you marketing superpowers with powerful features
        </Typography>
        <button className="btn text-white btn-primary btn-wide my-3"
        onClick={()=>{
            router.push("/onboarding/addSocial")
        }}
        >
            Get Started
        </button>
      </div>
    </div>
  );
}
