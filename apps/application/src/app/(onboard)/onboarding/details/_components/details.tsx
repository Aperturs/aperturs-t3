import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoaderIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";

import { completeOnboarding } from "~/app/(onboard)/_action";
import { api } from "~/trpc/react";
import Step from "./_steps";
import AboutYourself from "./about-yourself";
import StepThree from "./basic-content-preferences";
import { useDetailsContext } from "./details-provider";
import StepOne from "./industries";
import ReasonForPosting from "./reason-for-posting";
import Step2 from "./sub-industries";
import ToneOfPosting from "./tone";
import WhatToPost from "./why-posting";

export default function Details() {
  const [step, setStep] = React.useState(1);
  const [ref, { height }] = useMeasure();
  const {
    whatYouPost,
    reasonsForPosting,
    toneOfVoice,
    selectedSubTopic,
    selectedTopic,
    preferences,
  } = useDetailsContext();
  const router = useRouter();

  const { mutateAsync: addPreferences, isPending } =
    api.user.addPreferences.useMutation();

  const handleFinish = async () => {
    await addPreferences({
      preferences,
      subTopics: selectedSubTopic,
      linkedinContentOptions: [
        {
          whatToPost: whatYouPost,
          reasonsForPosting: reasonsForPosting,
          toneOfVoice: toneOfVoice,
          subTopics: selectedSubTopic,
          industry: selectedTopic.map((topic) => {
            {
              return {
                value: topic,
                label: topic,
              };
            }
          }),
        },
      ],
    });
    await completeOnboarding();
  };

  const handleNext = async () => {
    if (step === 7) {
      await toast.promise(handleFinish(), {
        loading: "Saving preferences...",
        success: "Preferences saved",
        error: "Failed to save preferences",
      });
    }
    if (step < 7) {
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
    if (step >= 2 && whatYouPost.length === 0) {
      toast.error("Please select at least one Topic");
      return;
    }
    if (step >= 3 && reasonsForPosting.length === 0) {
      toast.error("Please select at least one Reason");
      return;
    }
    if (step >= 4 && selectedTopic.length === 0) {
      toast.error("Please select at least one Industry");
      return;
    }
    if (step >= 5 && selectedSubTopic.length === 0) {
      toast.error("Please select at least one Sub Industry");
      return;
    }
    if (step >= 6 && toneOfVoice.length === 0) {
      toast.error("Please select at least one Tone");
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
            <CardDescription>
              This will help us create a fine-tuned experience for you, so make
              sure you give us all the details.
            </CardDescription>
            <div className="flex justify-between pt-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <button key={index} onClick={() => handleSetStep(index + 1)}>
                  <Step step={index + 1} currentStep={step} />
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 && <WhatToPost />}
            {step === 2 && <ReasonForPosting />}
            {step === 3 && <StepOne />}
            {step === 4 && <Step2 />}
            {step === 5 && <ToneOfPosting />}
            {step === 6 && <AboutYourself />}
            {step === 7 && <StepThree />}
          </CardContent>

          <CardFooter className="mt-10 flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button
              disabled={isPending}
              onClick={handleNext}
              className={`inline-flex items-center gap-2 ${step > 7 ? "pointer-events-none opacity-50" : ""}`}
            >
              {isPending && <LoaderIcon className="h-4 w-4 animate-spin" />}
              {step === 7 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </div>
      </motion.div>
    </div>
  );
}
