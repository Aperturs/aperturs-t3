import BgSvg from "~/components/bg-svg";
import Center from "~/components/center";

export default function Home() {
  return (
    <section className="relative">
      <Center>
        <main className="relative z-10 flex min-h-[70vh] flex-col items-start justify-center ">
          <div className="flex max-w-2xl justify-start lg:max-w-none">
            <div className="max-w-3xl">
              <h1 className="font-display text-5xl font-medium tracking-tight  text-neutral-950 [text-wrap:balance] sm:text-7xl">
                Just testing some landing page design
              </h1>
              <p className="mt-6 text-xl font-normal text-neutral-600">
                more test testinteslkl fsadjlf s alfljdsa flsdajflh dsajlf
                dsaljhf sajf lsaj flj dsaflj hdsalfjh dljsahf jdsahfljdhs alkjf
                ksajdhf kdsjhfeawoifhajn
              </p>
            </div>
          </div>
        </main>
      </Center>
      <BgSvg />
      <section className="inset-0 z-0 m-1 h-[60vh] rounded-lg bg-neutral-950"></section>
    </section>
  );
}
