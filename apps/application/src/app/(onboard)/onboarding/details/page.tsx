"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";

import Step from "./_components/_steps";
import {
  DetailsProvider,
  useDetailsContext,
} from "./_components/details-provider";
import StepOne from "./_components/step1";
import Step2 from "./_components/step2";
import StepThree from "./_components/step3";

export default function DetailsPage() {
  return (
    <DetailsProvider>
      <Details />
    </DetailsProvider>
  );
}

function Details() {
  const [step, setStep] = React.useState(1);
  const [ref, { height }] = useMeasure();

  const { selectedSubTopic, selectedTopic } = useDetailsContext();

  const handleNext = () => {
    if (selectedTopic.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (selectedSubTopic.length === 0 && step === 2) {
      toast.error("Please select at least one subtopic");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center  py-7 ">
      <motion.div
        className="rounded-xl bg-card text-card-foreground shadow dark:border md:w-[50%]"
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
              <Step step={1} currentStep={step} />
              <Step step={2} currentStep={step} />
              <Step step={3} currentStep={step} />
              {/* <Step step={4} currentStep={step} /> */}
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 && <StepOne />}
            {step === 2 && <Step2 />}
            {step === 3 && <StepThree />}
          </CardContent>

          <CardFooter className="mt-10 flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setStep(step < 2 ? step : step - 1)}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className={`${step > 4 ? "pointer-events-none opacity-50" : ""}`}
            >
              Continue
            </Button>
          </CardFooter>
        </div>
      </motion.div>
    </div>
  );
}
