import CallToAction from "~/components/home/cta";
import HeroSection from "~/components/home/dragable";
import Problem from "~/components/home/problem";
import Step from "~/components/home/step";

export default function page() {
  return (
    <section>
      <div className="h-screen 2xl:py-24 py-6">
        <HeroSection />
      </div>
      {/* <HeroSection /> */}
      <Problem />
      {/* <Step /> */}
      {/* <CallToAction /> */}
    </section>
  );
}
