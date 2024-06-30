import Image from "next/image";

import { Button } from "@aperturs/ui/button";

import FadeIn from "../fade-in";
import { BorderBeam } from "../ui/border-beam";
import { SparklesCore } from "../ui/sparkles";
import { Waitlist } from "./waitlist";

export default function HeroSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center pt-24 md:pt-48">
      <FadeIn className="flex flex-col items-center justify-center gap-1 px-5 py-10">
        <h1 className="mt-8 text-balance bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-2xl font-medium tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-7xl">
          Save Time Writing Content, <br /> Focus on What Matters Most
        </h1>
        <p className="mt-2 translate-y-[-1rem] text-balance text-center  text-sm tracking-tight text-gray-400 sm:text-lg md:max-w-[60rem]  md:text-xl">
          seamlessly integrate <b> posting, repurposing, and collaboration</b>,
          turning your chaotic workflow into an efficient and streamlined
          process.
        </p>
        {/* <Button>Start Free Trial</Button> */}
        <Waitlist />
      </FadeIn>
      <FadeIn>
        <div className="relative h-40 md:w-[20rem] lg:w-[40rem]">
          <div className="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
          <div className="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
          <div className="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="h-full w-full "
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </FadeIn>
      <div className="relative m-[-100px] md:m-0">
        <FadeIn initialY={20}>
          <div className="absolute bottom-0 z-30 h-[100%] w-full bg-gradient-to-t from-black to-transparent" />
          <Image
            src="/app.png"
            alt="App screenshot"
            width={1200}
            height={1200}
            className="relative z-20 w-[80vw]   rounded-lg border-2 border-white border-opacity-35 shadow-xl"
          />
          <BorderBeam
            duration={10}
            borderWidth={2}
            className="rounded-lg"
            colorFrom="#7c3aed"
            colorTo="#2563eb"
          />
        </FadeIn>
        <div className="gradient absolute left-[50%] top-[-100px] h-[400px] w-[100vw] md:h-[500px] " />{" "}
        1
      </div>
    </section>
  );
}
