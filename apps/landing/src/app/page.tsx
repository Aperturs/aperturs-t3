import HeroSection from "~/components/home/dragable";
import FadeInFeatures from "~/components/home/fadein-features";
import Problem from "~/components/home/problem";
import HowItWorks from "~/components/home/steps";

export default function page() {
  return (
    <section>
      <div className="h-screen 2xl:py-24 py-6 w-full">
        <HeroSection />
      </div>
      <FadeInFeatures />
      {/* <HeroSection /> */}
      {/* <Problem /> */}
      <HowItWorks />
      {/* <Step /> */}
      {/* <CallToAction /> */}
    </section>
  );
}
