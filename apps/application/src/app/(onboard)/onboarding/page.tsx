"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@aperturs/ui/button";

export default function Example() {
  const router = useRouter();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center py-24">
      <Image
        src="/logo.svg"
        className="w-32 dark:invert"
        width={200}
        height={200}
        alt="logo"
      />
      <h1 className=" my-0 mb-1 text-6xl font-bold">Hey Welcome to Aperturs</h1>
      <h2 className="my-0 mb-4 text-center text-lg font-bold text-muted-foreground">
        Aperturs gives you marketing superpowers with powerful features
      </h2>
      <Button variant="secondary" className="h-16 w-80">
        <Link href="/onboarding/add-social">Get Started</Link>
      </Button>
    </div>
  );
}
