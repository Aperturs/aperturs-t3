/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  // {
  //   title: "Connect Socials",
  //   description: "Connect your Linkedin Account",
  //   image: "/steps/connect-social.jpeg",
  // },
  {
    title: "Fill in Basic Details",
    description:
      "Fill in your basic details to get started, so our AI works to make a personalized experience for you",
    image: "/steps/details.jpeg",
  },
  {
    title: "Generate Posts",
    description:
      "Generate posts based on your interests and LinkedIn profile, or write your own.",
    image: "/steps/generate-post.jpeg",
  },
  {
    title: "Schedule Posts",
    description: "Schedule when you want them to be posted.",
    image: "/steps/schedule-post.jpeg",
  },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Set up a new timer for 4 seconds
    timerRef.current = setTimeout(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 4000);

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <section className="relative  pb-24">
      <div className="mx-auto max-w-4xl mb-10">
        <h3 className="text-balance text-center text-sm font-medium text-lime-700">
          How it works
        </h3>
        <h2 className="text-balance text-center text-3xl font-medium">
          Just 4 simple steps to get your LinkedIn Content Machine Rolling
        </h2>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:flex-row">
        <div className="w-full space-y-4 md:w-1/2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-start  space-x-4"
              onClick={() => handleStepClick(index)}
            >
              <div className="relative h-24 w-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  key={currentStep === index ? currentStep : undefined}
                  className={`absolute left-0 right-0 top-0 rounded-full bg-primary ${
                    index === currentStep ? "progress-bar" : ""
                  }`}
                  style={{
                    height: index < currentStep ? "100%" : "0%",
                  }}
                />
              </div>
              <div
                className={`flex h-full flex-1 flex-col justify-center ${
                  index === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center md:w-1/2">
          <Image
            src={steps[currentStep].image}
            alt={`Step ${currentStep + 1}`}
            width={600}
            height={400}
            className="h-[98%] w-full rounded-lg border object-cover shadow-md"
          />
        </div>

        {/* Include the CSS for the progress bar animation */}
        <style jsx>{`
          .progress-bar {
            animation: progressAnimation 4s linear forwards;
          }

          @keyframes progressAnimation {
            from {
              height: 0%;
            }
            to {
              height: 100%;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
