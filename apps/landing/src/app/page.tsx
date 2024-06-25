import Image from "next/image";

import FadeIn from "~/components/fade-in";
import { BorderBeam } from "~/components/ui/border-beam";
import { SparklesCore } from "~/components/ui/sparkles";

export default function page() {
  return (
    <section className="flex w-full flex-col items-center justify-center py-48">
      <FadeIn>
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-2xl font-medium tracking-tight text-transparent sm:text-4xl lg:text-7xl">
          Save Time Writing Content, <br /> Focus on What Matters Most
        </h1>
        <p className="mb-12 mt-2 max-w-[60rem] translate-y-[-1rem]  text-center text-lg tracking-tight text-gray-400  md:text-xl">
          seamlessly integrate <b> posting, repurposing, and collaboration</b>,
          turning your chaotic workflow into an efficient and streamlined
          process. Say goodbye to manual adjustments and hello to more time for
          strategy and creativity.
        </p>
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
            className="h-full w-full"
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 h-full w-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </FadeIn>
      <div className="relative">
        <FadeIn initialY={20}>
          <div className="absolute bottom-0 z-30 h-[100%] w-full bg-gradient-to-t from-black to-transparent" />
          <Image
            src="/app.png"
            alt="App screenshot"
            width={1200}
            height={1200}
            className="relative z-20 lg:w-[80vw]   rounded-lg border-2 border-white border-opacity-35 shadow-xl"
          />
          <BorderBeam
            duration={10}
            borderWidth={2}
            className="rounded-lg"
            colorFrom="#7c3aed"
            colorTo="#2563eb"
          />
        </FadeIn>
        <FadeIn duration={4} initialY={0}>
          <div className="gradient absolute left-[50%] top-[-200px] h-[400px] md:w-[90vw] md:h-[700px] " />
        </FadeIn>
        1
      </div>
    </section>
  );
}
