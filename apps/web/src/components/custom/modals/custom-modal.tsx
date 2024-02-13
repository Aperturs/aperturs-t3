"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "~/components/ui/dialog";
import { useModal } from "./modal-provider";

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModal = ({ children, defaultOpen, subheading, title }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="h-screen overflow-scroll bg-card md:h-fit md:max-h-[700px]">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
