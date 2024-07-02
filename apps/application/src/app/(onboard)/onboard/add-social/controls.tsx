"use client";

import { useRouter } from "next/navigation";

import { Button } from "@aperturs/ui/button";

export default function Controls() {
  const router = useRouter();
  return (
    <div className="flex justify-between">
      <Button
        onClick={() => {
          router.push("/onboard");
        }}
      >
        Back
      </Button>
      <Button
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        Next
      </Button>
    </div>
  );
}
