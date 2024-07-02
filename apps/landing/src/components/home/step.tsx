"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@aperturs/ui/carousel";

import { PinContainer } from "../ui/3d-pin";
import { AnimatedBeamConnect } from "./logo-connect";

import "./step.css";

import { Button } from "@aperturs/ui/button";

import { ConfettiFireworks } from "./trigger-schedule";

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
      <div className="w-full  lg:h-[20vh] relative">
        <PinContainer
          title="Create Content with ease and speed"
          href="/"
          className="w-full "
        >
          <div className="h-[40vh] md:h-[20vh] lg:h-[18vh] w-full">
            <Image
              src="/features1.png"
              alt="App"
              width={1200}
              height={1200}
              className="relative object-cover z-20 mt-4 w-full h-full object-left-top rounded-lg border-2 border-white border-opacity-20 "
            />
          </div>
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
          <div className="card-pic relative h-full w-full">{children}</div>
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
    <section className="cardslider_container py-6">
      <div className="section-2 relative mb-0 lg:mt-[111px] lg:h-[600vh] lg:pb-5 lg:pt-20">
        <div className="scroll-card flex flex-col justify-between lg:sticky lg:top-0 lg:flex-row">
          <div className="left-card  my-10 flex w-full flex-col justify-center max-lg:items-center lg:h-[100vh] lg:w-[50%]">
            <div className="w-fit bg-gradient-to-tr from-primary to-blue-400 bg-clip-text text-xl font-black tracking-wide text-transparent max-lg:text-center">
              Workflow
            </div>
            <hr className="mb-6 h-1  w-16 rounded-full bg-gradient-to-tr from-primary to-blue-200" />
            <div className="mb-3 w-full text-balance text-center text-5xl font-bold lg:text-left">
              Create Content at the speed of thought.
            </div>
            <div className="left-content w-full text-center max-lg:text-balance lg:pr-[25%] lg:text-left">
              Focus on your getting your thoughts out and crafting the best
              message while Aperturs does the heavy lifting for you
            </div>
          </div>
          <div className="right-card hidden items-center justify-center lg:flex ">
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
          <div className="flex w-full justify-center lg:hidden">
            <Carousel className="w-[90vw]">
              <SlideCard />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

function SlideCard() {
  const { scrollPrev, canScrollPrev, scrollNext, canScrollNext } =
    useCarousel();
  return (
    <>
      <CarouselContent>
        {cardArr.map((card, index) => (
          <CarouselItem key={index}>
            <div>
              <div className="relative flex h-[70vh] md:h-[50vh] min-h-fit w-full flex-col items-center justify-between rounded-3xl bg-[#101010] p-3">
                <div className="card-pic relative h-full w-full">
                  {card.children}
                </div>
                <div className="h-full p-4 my-3">
                  <div className="mb-1 text-2xl md:text-3xl font-bold">
                    {card.CardTitle}
                  </div>
                  <div className="text-base md:text-lg font-normal text-muted-foreground">
                    {card.CardDescription}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="my-3 flex justify-between">
        <Button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="w-1/2 bg-white hover:bg-white dark:text-black "
        >
          Prev
        </Button>
        <Button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="w-1/2 bg-white hover:bg-white dark:text-black"
        >
          Next
        </Button>
      </div>
    </>
  );
}

export default CardSlider;
