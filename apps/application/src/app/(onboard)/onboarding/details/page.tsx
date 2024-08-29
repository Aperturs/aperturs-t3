"use client";

import React from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

import { Button } from "@aperturs/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";

import Step from "./_components/_steps";
import { DetailsProvider } from "./_components/details-provider";
import StepOne from "./_components/step1";
import Step2 from "./_components/step2";

export default function DetailsPage() {
  const [step, setStep] = React.useState(1);
  const [ref, { height }] = useMeasure();

  return (
    <DetailsProvider>
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
                <Step step={4} currentStep={step} />
              </div>
            </CardHeader>

            <CardContent>
              {step === 1 && <StepOne />}
              {step === 2 && <Step2 />}
            </CardContent>

            <CardFooter className="mt-10 flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(step < 2 ? step : step - 1)}
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(step > 4 ? step : step + 1)}
                className={`${step > 4 ? "pointer-events-none opacity-50" : ""}`}
              >
                Continue
              </Button>
            </CardFooter>
          </div>
        </motion.div>
      </div>
    </DetailsProvider>
  );
}
