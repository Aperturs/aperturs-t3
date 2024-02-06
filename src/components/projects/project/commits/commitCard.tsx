// components/CommitCard.tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "~/components/ui/card";

interface CommitCardProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
  onToggle: (id: number) => void;
}

const CommitCard: React.FC<CommitCardProps> = ({
  id,
  title,
  description,
  checked,
  onToggle,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto my-2 w-4/5"
    >
      <Card className="p-4" onClick={() => onToggle(id)}>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={checked}
            onChange={() => onToggle(id)}
          />
          <div className="ml-4">
            <h5 className="mb-1">{title}</h5>
            <p>{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CommitCard;
