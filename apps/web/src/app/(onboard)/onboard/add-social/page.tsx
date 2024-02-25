"use client";

import { useRouter } from "next/navigation";

import FetchPersonalSocials from "~/app/(personal)/socials/fetch-socials";
import { AddSocialPersonal } from "~/components/profile/connect-socials/personal/personal-social-connect";
import ConnectSocials from "~/components/profile/connect-socials/socials";

function AddSocial() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="w-[75%]">
        <div className="flex flex-col items-center justify-center">
          <ConnectSocials>
            <FetchPersonalSocials />
            <AddSocialPersonal />
          </ConnectSocials>
        </div>{" "}
        <div className="flex justify-between">
          <button
            className="btn btn-primary btn-wide my-3 text-white"
            onClick={() => {
              router.push("/onboarding");
            }}
          >
            Back
          </button>
          <button
            className="btn btn-primary btn-wide my-3 text-white"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSocial;
