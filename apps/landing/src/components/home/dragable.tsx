"use client";

import type {
  AnimationControls,
  Target,
  TargetAndTransition,
  VariantLabels,
} from "framer-motion";
import React from "react";
import Link from "next/link";
import {
  BoltIcon,
  CameraIcon,
  MicrophoneIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  MessageSquare,
  MoreHorizontal,
  Send,
  Share2,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@aperturs/ui/avatar";
import { Button } from "@aperturs/ui/button";
import { Card } from "@aperturs/ui/card";
import { Input } from "@aperturs/ui/input";
import { cn } from "@aperturs/ui/lib/utils";

import { AnimatedGroup } from "../ui/animated-group";
import { WrapCover } from "./wrap-text-cover";
import posthog from "posthog-js";

const DraggableCard = ({
  children,
  initial,
  animate,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  initial?: boolean | Target | VariantLabels;
  animate?: AnimationControls | TargetAndTransition;
}) => (
  <motion.div
    drag
    dragMomentum={false}
    initial={initial}
    animate={{
      ...animate,
      transition: {
        duration: 0.5,
        type: "spring",
        damping: 10,
        stiffness: 50,
      },
    }} // Combine animate with transition
    transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
    whileDrag={{ scale: 0.9 }}
    whileHover={{ rotate: 2 }}
    className={cn("absolute", className)}
  >
    <Card className="w-80 cursor-move p-4 shadow-lg">{children}</Card>
  </motion.div>
);

export default function HeroSection() {
  return (
    <div className="relative grid h-full w-full place-content-center overflow-hidden rounded-lg border bg-background p-4">
      <AnimatedGroup
        preset="blur"
        className="flex flex-col items-center justify-center gap-1 px-5 py-10"
      >
        <h1 className="mt-8  max-w-4xl text-balance bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text py-4 text-center text-2xl font-medium tracking-tight text-transparent sm:text-4xl md:text-4xl lg:text-5xl">
          Grow your LinkedIn in <WrapCover>Weeks</WrapCover> with just{" "}
          <WrapCover>Minutes</WrapCover> of work
        </h1>
        <p className="mt-2 translate-y-[-1rem] text-balance text-center  text-sm tracking-tight text-muted-foreground sm:text-lg md:max-w-[60rem]  md:text-xl">
          seamlessly integrate <b> posting, repurposing, and collaboration</b>,
          turning your chaotic workflow into an efficient and streamlined
          process.
        </p>
        <div className="flex md:flex-row flex-col items-center justify-center gap-2">
          <Button asChild>
            <Link
            onClick={() => {
              posthog.capture('sign_up_button_clicked', { property: 'from hero section' })
            }}
            href="https://app.aperturs.com/sign-up">Start Free Trial</Link>
          </Button>
          <Button asChild>
            <Link href="https://cal.com/swaraj/15min">Schedule a Demo</Link>
          </Button>
        </div>
      </AnimatedGroup>
      <AnimatedGroup preset="fade">
        <DraggableCard
          initial={{ top: -100, left: -230, rotate: 10 }}
          animate={{
            top: -30,
            left: -200,
          }}
        >
          <h3 className="mb-2 font-semibold">Create Post</h3>
          <form>
            <textarea
              placeholder="What's on your mind?"
              //   value={postContent}
              //   onChange={(e) => setPostContent(e.target.value )}
              className="mb-2"
            />
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="icon" variant="ghost">
                  <CameraIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <PhotoIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <VideoCameraIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MicrophoneIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit">Post</Button>
            </div>
          </form>
        </DraggableCard>

        <DraggableCard
          initial={{ top: -100, right: "25%", rotate: -10 }}
          animate={{
            top: -50,
            right: "25%",
          }}
        >
          <h3 className="mb-2 font-semibold">AI Content Generator</h3>
          <form>
            <Input placeholder="Enter prompt for AI" className="mb-2" />
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="icon" variant="ghost">
                  <BoltIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit">Generate</Button>
            </div>
          </form>
        </DraggableCard>

        <DraggableCard
          initial={{ bottom: -100, left: -200, rotate: 10 }}
          animate={{
            bottom: 40,
            left: -160,
          }}
          className="hidden md:block"

        >
          <h3 className="mb-2 font-semibold">Messages</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  Hey, how&apos;s it going?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-muted-foreground">
                  Did you see the latest post?
                </p>
              </div>
            </div>
          </div>
          <Input className="mt-2" placeholder="Type a message..." />
          <Button size="sm" className="mt-2">
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
        </DraggableCard>

        <DraggableCard
          initial={{ bottom: -100, right: "25%", rotate: -10 }}
          animate={{
            bottom: -80,
            right: "25%",
          }}
          className="hidden md:block"

        >
          <h3 className="mb-2 font-semibold">Trending Posts</h3>
          <div className="space-y-2">
            <div className="border-b pb-2">
              <p className="font-medium">AI generates hyper-realistic art</p>
              <div className="mt-1 flex items-center space-x-2">
                <Button size="icon" variant="ghost">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="font-medium">New social media platform launches</p>
              <div className="mt-1 flex items-center space-x-2">
                <Button size="icon" variant="ghost">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DraggableCard>

        <DraggableCard
          initial={{ top: -100, left: "20%" }}
          animate={{
            top: -60,
            left: "20%",
          }}
          className="hidden md:block"
        >
          <h3 className="mb-2 font-semibold">Friend Suggestions</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <p className="font-medium">Alice Smith</p>
              </div>
              <Button size="sm">Add</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>BJ</AvatarFallback>
                </Avatar>
                <p className="font-medium">Bob Johnson</p>
              </div>
              <Button size="sm">Add</Button>
            </div>
          </div>
        </DraggableCard>

        <DraggableCard
          initial={{ top: -100, right: -200, rotate: -10 }}
          animate={{
            top: -30,
            right: -150,
          }}
          className="hidden md:block"

        >
          <h3 className="mb-2 font-semibold">AI-Generated Content Ideas</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>5 ways to boost your productivity</li>
            <li>The future of renewable energy</li>
            <li>How AI is transforming healthcare</li>
            <li>Top travel destinations for 2023</li>
          </ul>
          <Button size="sm" className="mt-2">
            Generate More
          </Button>
        </DraggableCard>

        <DraggableCard
          initial={{ bottom: -70, left: "20%", rotate: 10 }}
          animate={{
            bottom: -100,
            left: "25%",
          }}
        >
          <h3 className="mb-2 font-semibold">Social Media Analytics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Followers:</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>Posts:</span>
              <span className="font-medium">56</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement Rate:</span>
              <span className="font-medium">4.7%</span>
            </div>
          </div>
          <Button size="sm" className="mt-2">
            View Full Report
          </Button>
        </DraggableCard>

        <DraggableCard
          initial={{ bottom: -100, right: -170, rotate: 20 }}
          animate={{
            bottom: -40,
            right: -160,
          }}
          className="hidden md:block"

        >
          <h3 className="mb-2 font-semibold">Content Calendar</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Mon: AI trends post</span>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Wed: Live Q&A session</span>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Fri: Product launch</span>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button size="sm" className="mt-2">
            Add Event
          </Button>
        </DraggableCard>
      </AnimatedGroup>
    </div>
  );
}
