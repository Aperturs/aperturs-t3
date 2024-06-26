'use client';

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  ];

  const Card = ({
    CardTitle,
    CardDescription,
  }: {
    CardTitle: string;
    CardDescription: string;
  }) => {
    return (
      <div className="card">
        <div className="card-pic"></div>
        <div className="card-info">
          <div className="card-title">{CardTitle}</div>
          <div className="card-description">{CardDescription}</div>
        </div>
      </div>
    );
  };

  // Display the current card based on the currentCardIndex
  const currentCard =
    cardArr.length > 0 ? cardArr[currentCardIndex % cardArr.length] : null;

  return (
    <section className="cardslider_container">
      <div className="section-2">
        <div className="scroll-card">
          <div className="left-card">
            <div className="left-title">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-[3px]"
              >
                <path
                  d="M8.75348 17.6952C7.72056 14.0706 3.94416 10.3084 0.305928 9.27938C-0.101976 9.14829 -0.101976 8.8599 0.305928 8.72226C3.95074 7.68666 7.72056 3.931 8.76005 0.299863C8.8719 -0.0999545 9.14164 -0.0999545 9.25349 0.299863C10.2864 3.931 14.0628 7.68666 17.6945 8.72226C18.1024 8.85335 18.1024 9.14829 17.6945 9.27938C14.0562 10.3084 10.2798 14.0706 9.24691 17.6952C9.13506 18.1016 8.86532 18.1016 8.75348 17.6952Z"
                  fill="#A594FD"
                ></path>
              </svg>
              Workflow
            </div>
            <div className="left-heading">Create at the speed of thought.</div>
            <div className="left-content">
              Focus on your getting your thoughts out and crafting the best
              message while Chronicle does the heavy lifting for you
            </div>
          </div>
          <div className="right-card">
            {currentCard ? (
              <Card
                CardTitle={currentCard.CardTitle}
                CardDescription={currentCard.CardDescription}
              />
            ) : (
              <p>No cards available</p>
            )}
            <div className="scroll">
              <span className="page">01</span>
              <div className="scroll-bg">
                <motion.div
                  className="scroll-bar"
                  style={{
                    height: height,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                ></motion.div>
              </div>
              <span className="page">03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
