"use client";

import Link from "next/link";

import { Button } from "@aperturs/ui/button";

import { completeOnboarding } from "../../_action";

export default function Controls() {
  return (
    <div className="my-3 flex justify-between gap-2">
      <Button className="w-full">
        <Link href="/onboarding">Back</Link>
      </Button>
      <Button
        className="w-full"
        onClick={async () => {
          await completeOnboarding();
          console.log("Onboarding completed");
        }}
      >
        <Link href="/dashboard">Let&apos;s Gooooo..</Link>
      </Button>
    </div>
  );
}
