import HeroSection from "~/components/home/hero";
import Problem from "~/components/home/problem";
import Step from "~/components/home/step";

export default function page() {
  return (
    <section>
      <HeroSection />
      <Problem />
      <Step />
      <div className="h-96">

      </div>
    </section>
  );
}
