import HeroSection from "~/components/home/dragable";
import FadeInFeatures from "~/components/home/fadein-features";
import HowItWorks from "~/components/home/steps";

export default function page() {
  return (
    <section>
      <div className="h-screen  w-full py-6">
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
