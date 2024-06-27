"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import "./step.css";

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
      CardTitle: "A keyboard first experience.",
      CardDescription:
        "Powerful shortcuts and a keyboard-first workflow means you will get to your finish line in no time!",
    },
    {
      CardTitle: "A powerful assistant just a click away",
      CardDescription:
        "Insert blocks, perform powerful actions and leverage the limitless power of AI - all without leaving your keyboard",
    },
    {
      CardTitle: "Bullets to visuals in a click",
      CardDescription:
        "Transform any block to any other and try different options without any design hassle",
    },
    {
      CardTitle: "A powerful assistant just a click away",
      CardDescription:
        "Insert blocks, perform powerful actions and leverage the limitless power of AI - all without leaving your keyboard",
    },
  ];

  const Card = ({
    CardTitle,
    CardDescription,
  }: {
    CardTitle: string;
    CardDescription: string;
  }) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 500,
          rotateX: 20,
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
          rotateX: 20,
          transition: { duration: 0.3},
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 50,
        }}
        className="card"
      >
        <div className="card-pic"></div>
        <div className="card-info">
          <div className="card-title">{CardTitle}</div>
          <div className="card-description">{CardDescription}</div>
        </div>
      </motion.div>
    );
  };

  // Display the current card based on the currentCardIndex
  const currentCard =
    cardArr.length > 0 ? cardArr[currentCardIndex % cardArr.length] : null;

  return (
    <section className="cardslider_container">
      <div className="section-2">
        <div className="scroll-card">
          <div className="left-card gird place-content-center">
            <div className="text-md mb-4 font-medium text-primary">
              Workflow
            </div>
            <div className="left-heading">Create at the speed of thought.</div>
            <div className="left-content">
              Focus on your getting your thoughts out and crafting the best
              message while Chronicle does the heavy lifting for you
            </div>
          </div>
          <div className="right-card flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentCard ? (
                <Card
                  key={currentCard.CardTitle}
                  CardTitle={currentCard.CardTitle}
                  CardDescription={currentCard.CardDescription}
                />
              ) : (
                <p>No cards available</p>
              )}
            </AnimatePresence>
            <div className="scroll">
              <span className="page">01</span>
              <div className="scroll-bg bg-primary">
                <motion.div
                  className="scroll-bar bg-gradient-to-b from-primary/80 to-primary"
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
