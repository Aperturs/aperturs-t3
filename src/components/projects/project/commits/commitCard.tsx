// components/CommitCard.tsx
'use client'

import { motion } from "framer-motion";
import { Card, Typography } from "@material-tailwind/react";

interface CommitCardProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
  onToggle: (id: number) => void;
}



const CommitCard: React.FC<CommitCardProps> = ({ id, title, description, checked, onToggle }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-4/5 mx-auto my-2"
    >
      <Card className="p-4"  onClick={()=>onToggle(id)}>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={checked}
            onChange={() => onToggle(id)}
          />
          <div className="ml-4">
            <Typography variant="h5" className="mb-1">
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CommitCard;
