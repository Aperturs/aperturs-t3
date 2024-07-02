import FadeIn from "../fade-in";
import { Waitlist } from "./waitlist";

export default function CallToAction() {
  return (
    <section className="my-2 flex w-full justify-center" id="callto">
      <div className="w-full px-5 sm:px-8 lg:px-10 xl:px-0">
        <div className="border-1 h-full w-full rounded-lg border-white bg-foreground p-20 text-background">
          <FadeIn>
            <h2 className="font-display text-center text-4xl font-medium">
              Ready to get started?
            </h2>
            {/* <p className="mt-4 text-center text-lg">
              Tell us about your project
            </p> */}
            <div className="mt-8 flex justify-center gap-4">
              {/* <Button className="bg-background text-foreground hover:bg-background">
                <a href="mailto:swaraj@aperturs.com">Mail Us</a>
              </Button> */}
              <Waitlist />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
