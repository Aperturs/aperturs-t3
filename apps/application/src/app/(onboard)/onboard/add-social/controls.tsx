"use client";

import { useRouter } from "next/navigation";

export default function Controls() {
  const router = useRouter();
  return (
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
  );
}
