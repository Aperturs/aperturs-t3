import Comp from "./comp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Image width={200} height={200} src="/test.svg" alt="test" className="w-full h-full" /> */}
      <Comp />
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
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
  );
}
