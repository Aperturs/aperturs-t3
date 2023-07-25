import { Card } from "@material-tailwind/react";
import React from "react";

interface CardProps {
  time: string;
  type: string;
}

const QueueCard: React.FC<CardProps> = ({ time, type }) => {
  return (
    <Card
      shadow={false}
      className="shadow-mdc group flex flex-row bg-secondary px-5 py-6 font-bold "
    >
      <div className="time">{time}</div>
      <div className="mx-5 hidden ease-in-out group-hover:flex">{type}</div>
    </Card>
  );
};

export default QueueCard;
