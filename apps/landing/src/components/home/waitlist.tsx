"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

import { Button } from "@aperturs/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aperturs/ui/dialog";
import { Input } from "@aperturs/ui/input";
import { Label } from "@aperturs/ui/label";

import { submitToWaitlist } from "~/lib/actions";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleConfetti = async () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = async () => {
      if (Date.now() > end) return;

      await confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      await confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    await frame();
  };

  const handleSubmit = async () => {
    console.log("submitting");
    // e.preventDefault();
    setLoading(true);
    try {
      await submitToWaitlist(email, name);
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      toast.success("You've been added to the waitlist!");
      await handleConfetti();
      setEmail("");
      setName("");
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button>Join WaitList</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Aperturs Waitlist</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Pedro Duarte"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                placeholder="peduarte@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={loading} type="submit" onClick={handleSubmit}>
                {loading ? "Loading..." : "Join Waitlist"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
