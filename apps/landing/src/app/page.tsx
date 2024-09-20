import HeroSection from "~/components/home/dragable";
import FadeInFeatures from "~/components/home/fadein-features";
import HowItWorks from "~/components/home/steps";
import PricingComponent from "~/components/pricing/cards";

export default function page() {
  return (
    <section className="w-full">
      <div className="h-screen  w-full py-6">
        <HeroSection />
      </div>
      <FadeInFeatures />
      {/* <HeroSection /> */}
      {/* <Problem /> */}
      <HowItWorks />
      <PricingComponent />
      {/* <Step /> */}
      {/* <CallToAction /> */}
    </section>
  );
}
