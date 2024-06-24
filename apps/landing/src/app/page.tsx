import React from "react";
import Image from "next/image";

import { BorderBeam } from "~/components/ui/border-beam";
import LinearGradient from "~/components/ui/linear-gradient";
import { SparklesCore } from "~/components/ui/sparkles";

export default function page() {
  return (
    <section className="flex w-full flex-col items-center justify-center py-48">
      <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Save Time Writing Content
      </h1>
      <div className="relative h-40 w-[40rem]">
        <div className="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
        <div className="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
        <div className="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      <div className="relative">
        <div className="absolute w-full z-10 bottom-0 bg-gradient-to-t from-black to-transparent h-[50%]" />
        <Image
          src="/app.png"
          alt="App screenshot"
          width={1500}
          height={1500}
          objectPosition="center"
          className="rounded-lg border-4 border-white shadow-xl border-opacity-35" 
        />
        <BorderBeam duration={7} borderWidth={4} className="rounded-lg"/>
      </div>
    </section>
  );
}
