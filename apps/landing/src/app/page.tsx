import Comp from "./comp";
import { BoxesCore } from "./test";
import { BackgroundBoxesDemo } from "./test2";

export default function Home() {
  return (
    <section className="relative rounded-t-[50px] bg-white">
      {/* <main className="relative  flex min-h-screen flex-col items-center justify-between rounded-lg  p-24">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl font-medium tracking-tight  text-neutral-950 [text-wrap:balance] sm:text-7xl">
              Just testing some landing page design
            </h1>
            <p className="mt-6 text-xl font-normal text-neutral-600">
              more test testinteslkl fsadjlf s alfljdsa flsdajflh dsajlf dsaljhf
              sajf lsaj flj dsaflj hdsalfjh dljsahf jdsahfljdhs alkjf ksajdhf
              kdsjhfeawoifhajn
            </p>
          </div>
        </div>
      </main>
      <Comp /> */}
      <BackgroundBoxesDemo />
    </section>
  );
}
