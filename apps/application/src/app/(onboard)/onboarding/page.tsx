import Image from "next/image";
import Link from "next/link";

import { Button } from "@aperturs/ui/button";

export default function Example() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center py-24">
      <Image
        src="/logo.svg"
        className="w-32 dark:invert"
        width={200}
        height={200}
        alt="logo"
      />
      <h1 className="my-4 max-w-3xl text-balance  text-center  text-4xl font-bold">
        Sup Buddy! Welcome to Aperturs and Thank you for Signing Up
      </h1>
      {/* <h2 className="my-0 mb-4 text-center text-lg font-bold text-muted-foreground">
        we will ask you a few questions to get to know you better and help you
        create better content
      </h2> */}

      <Button asChild variant="secondary" className="h-16 w-80">
        <Link href="/onboarding/add-social">Get Started</Link>
      </Button>
    </div>
  );
}
