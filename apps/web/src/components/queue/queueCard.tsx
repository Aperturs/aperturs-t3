import React from "react";

import { Card } from "../ui/card";

interface CardProps {
  time: string;
  type: string;
}

const QueueCard: React.FC<CardProps> = ({ time, type }) => {
  return (
    <Card className="shadow-mdc group flex flex-row bg-secondary px-5 py-6 font-bold ">
      <div className="time">{time}</div>
      <div className="mx-5 hidden ease-in-out group-hover:flex">{type}</div>
    </Card>
  );
};

export default QueueCard;
