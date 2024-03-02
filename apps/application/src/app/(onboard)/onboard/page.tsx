"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Example() {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-center py-24">
      <div className="flex w-full max-w-lg flex-col items-center justify-center">
        <Image
          src="/logo.svg"
          className="max-w-sm"
          width={200}
          height={200}
          alt="logo"
        />
        <h2 className="my-4" color="indigo">
          Welcome to Aperturs
        </h2>
        <h2 className="text-center" color="gray">
          Aperturs gives you marketing superpowers with powerful features
        </h2>
        <button
          className="btn btn-primary btn-wide my-3 text-white"
          onClick={() => {
            router.push("/onboarding/addSocial");
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
