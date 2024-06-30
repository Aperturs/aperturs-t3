"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import { PinContainer } from "../ui/3d-pin";
import { AnimatedBeamConnect } from "./logo-connect";

import "./step.css";

import { ConfettiFireworks } from "./trigger-schedule";

const CardSlider = () => {
  const { scrollYProgress } = useScroll();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newIndex = Math.floor(scrollYProgress.get() * cardArr.length);
      setCurrentCardIndex(newIndex);
    };

    const unsubscribeScroll = scrollYProgress.onChange(handleScroll);

    return () => {
      unsubscribeScroll();
    };
  }, [scrollYProgress]);

  const height = useTransform(
    scrollYProgress,
    [0, 1, 2],
    ["0", "100%", "100%"],
  );

  const cardArr = [
    {
      CardTitle: "Connect all your Socials",
      CardDescription:
        "Manage all your social media accounts in one place and post everywhere at once",
      children: (
        <div className="p-10">
          <AnimatedBeamConnect />
        </div>
      ),
    },
    {
      CardTitle: "Create Content with ease and speed",
      CardDescription:
        "Create content with ease and speed using our templates, and repurpose them with a click",
      children: (
        <div className="w-full">
          <PinContainer
            title="Create Content with ease and speed"
            href="/"
            className="w-full"
          >
            <Image
              src="/features1.png"
              alt="App"
              width={1200}
              height={1200}
              className="relative z-20 mt-4 w-full rounded-lg border-2 border-white border-opacity-20 "
            />
          </PinContainer>
        </div>
      ),
    },
    {
      CardTitle: "Trigger Schedule with a click",
      CardDescription:
        "Trigger schedule your content to be posted at the best time for your audience",
      children: <ConfettiFireworks />,
    },
  ];

  const Card = ({
    children,
    CardTitle,
    CardDescription,
  }: {
    children?: React.ReactNode;
    CardTitle: string;
    CardDescription: string;
  }) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: currentCardIndex === 0 ? 1 : 0.8,
          y: 500,
          rotateX: currentCardIndex === 0 ? 0 : -30,
          shadow: "20px",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          transition: { duration: 0.5 },
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          y: 500,
          rotateX: 30,
          transition: { duration: 0.3 },
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 50,
        }}
      >
        {/* <ShineBorder color={["#8b5cf6","#446CEC"]} borderWidth={3}> */}
        <div className="relative flex h-[45vh] w-full flex-col items-center justify-between rounded-3xl bg-[#101010] p-12">
          <div className="card-pic relative w-full h-full">{children}</div>
          <div className=" my-3">
            <div className="mb-1 text-3xl font-bold">{CardTitle}</div>
            <div className="text-lg font-normal text-muted-foreground">
              {CardDescription}
            </div>
          </div>
        </div>
        {/* </ShineBorder> */}
      </motion.div>
    );
  };

  // Display the current card based on the currentCardIndex
  const currentCard =
    cardArr.length > 0 ? cardArr[currentCardIndex % cardArr.length] : null;

  return (
    <section className="cardslider_container">
      <div className="lg:section-2">
        <div className="scroll-card flex flex-col lg:flex-row justify-between lg:top-0 lg:sticky">
          <div className="left-card lg:w-[50%] h-[100vh]  gird place-content-center">
            <div className="w-fit bg-gradient-to-tr from-primary to-blue-400 bg-clip-text text-xl font-black tracking-wide text-transparent">
              Workflow
            </div>
            <hr className="mb-6 h-1  w-16 rounded-full bg-gradient-to-tr from-primary to-blue-200" />
            <div className="mb-3 text-balance text-5xl font-bold">
              Create Content at the speed of thought.
            </div>
            <div className="left-content">
              Focus on your getting your thoughts out and crafting the best
              message while Aperturs does the heavy lifting for you
            </div>
          </div>
          <div className="right-card lg:flex items-center justify-center hidden ">
            <AnimatePresence mode="wait">
              {currentCard ? (
                <Card
                  key={currentCard.CardTitle}
                  CardTitle={currentCard.CardTitle}
                  CardDescription={currentCard.CardDescription}
                >
                  {currentCard.children}
                </Card>
              ) : (
                <p>No cards available</p>
              )}
            </AnimatePresence>
            <div className="scroll">
              <span className="page">01</span>
              <div className="scroll-bg bg-primary">
                <motion.div
                  className="scroll-bar bg-gradient-to-b from-primary/10 to-primary"
                  style={{
                    height: height,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                ></motion.div>
              </div>
              <span className="page">0{cardArr.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
