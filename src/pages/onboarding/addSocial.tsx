import { useRouter } from "next/router";
import React from "react";
import { ConnectSocials } from "~/components";

function AddSocial() {
  
    const router = useRouter();
    return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
    <div className="w-[75%]">
      <ConnectSocials />
      <div className="flex justify-between">
        <button className="btn text-white btn-primary btn-wide my-3"
        onClick={()=>{
            router.push("/onboarding")
        }}
        >Back</button>
        <button className="btn text-white btn-primary btn-wide my-3"
        onClick={()=>{
            router.push("/dashboard")
        }}
        >Next</button>
      </div>
    </div>
    </div>
  );
}

export default AddSocial;
