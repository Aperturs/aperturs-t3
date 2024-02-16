import React from "react";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";

import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardHeader } from "@aperturs/ui/card";

interface SingleInfoProps {
  title: string;
  link: string;
}

interface EmptyInfoProps {
  emptyText: string;
  buttonText: string;
  buttonLink: string;
}

interface InfoContainerProps {
  title: string;
  infoBlocks: SingleInfoProps[];
  emptyInfo: EmptyInfoProps;
}

export default function InfoContainer({
  title,
  infoBlocks,
  emptyInfo,
}: InfoContainerProps) {
  console.log(infoBlocks);
  return (
    <Card className="py-5">
      <CardHeader color="gray" className="mb-4 grid h-16 place-items-center">
        {title}
      </CardHeader>
      <CardContent>
        {infoBlocks.length === 0 && (
          <div className="flex w-full flex-1 flex-col items-center justify-center px-5">
            <p className="text-lg font-medium">{emptyInfo.emptyText}</p>
            <Button variant="link">
              <Link href={emptyInfo.buttonLink}>{emptyInfo.buttonText}</Link>
            </Button>
          </div>
        )}
        {infoBlocks.map((block) => {
          return (
            <React.Fragment key={block.title}>
              <div className="flex w-full items-center justify-between px-5">
                <p className="text-lg font-medium">{block.title}</p>
                <Link href={block.link}>
                  <Button size="icon">
                    <BsArrowUpRight />
                  </Button>
                </Link>
              </div>
              <hr className="mx-5 my-3" />
            </React.Fragment>
          );
        })}
        {/* <div className="flex items-center justify-between px-5">
        <p className="text-lg font-medium">some testing text</p>
        <Link href={link}>
          <IconButton>
            <BsArrowUpRight />
          </IconButton>
        </Link>
      </div> */}
      </CardContent>
    </Card>
  );
}
