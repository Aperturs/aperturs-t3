import React from "react";
import { useRouter } from "next/navigation";
import { add } from "date-fns";
import { motion } from "framer-motion";
import { LoaderIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";

import { completeOnboarding } from "~/app/(onboard)/_action";
import { api } from "~/trpc/react";
import Step from "./_steps";
import { useDetailsContext } from "./details-provider";
import StepOne from "./step1";
import Step2 from "./step2";
import StepThree from "./step3";

export default function Details() {
  const [step, setStep] = React.useState(1);
  const [ref, { height }] = useMeasure();
  const { selectedSubTopic, selectedTopic, preferences } = useDetailsContext();
  const router = useRouter();

  const { mutateAsync: addPreferences, isPending } =
    api.user.addPreferences.useMutation();

  const handleFinish = async () => {
    await addPreferences({ preferences, subTopics: selectedSubTopic });
    await completeOnboarding();
  };

  const handleNext = async () => {
    if (selectedTopic.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (selectedSubTopic.length === 0 && step === 2) {
      toast.error("Please select at least one subtopic");
      return;
    }
    if (step === 3) {
      await toast.promise(handleFinish(), {
        loading: "Saving preferences...",
        success: "Preferences saved",
        error: "Failed to save preferences",
      });
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      return router.push("/onboarding/pick-plan");
    }
    setStep(step - 1);
  };

  const handleSetStep = (step: number) => {
    if (step === 2 && selectedTopic.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (step === 3 && selectedSubTopic.length === 0) {
      toast.error("Please select at least one subtopic");
      return;
    }
    setStep(step);
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center  py-7 ">
      <motion.div
        className="w-[95%] rounded-xl bg-card text-card-foreground shadow dark:border sm:w-[90%] lg:w-[80%] xl:w-[50%]"
        initial={{
          height: "auto",
        }}
        animate={{
          height: height > 0 ? height : undefined,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div ref={ref}>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <div className="flex justify-between pt-4">
              <button onClick={() => handleSetStep(1)}>
                <Step step={1} currentStep={step} />
              </button>
              <button onClick={() => handleSetStep(2)}>
                <Step step={2} currentStep={step} />
              </button>
              <button onClick={() => handleSetStep(3)}>
                <Step step={3} currentStep={step} />
              </button>
              {/* <Step step={4} currentStep={step} /> */}
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 && <StepOne />}
            {step === 2 && <Step2 />}
            {step === 3 && <StepThree />}
          </CardContent>

          <CardFooter className="mt-10 flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button
              disabled={isPending}
              onClick={handleNext}
              className={`inline-flex items-center gap-2 ${step > 4 ? "pointer-events-none opacity-50" : ""}`}
            >
              {isPending && <LoaderIcon className="h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </CardFooter>
        </div>
      </motion.div>
    </div>
  );
}
