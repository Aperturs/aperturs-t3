import { Card, CardHeader, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";

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
  emptyInfo?: EmptyInfoProps;
}

export default function InfoContainer({
  title,
  infoBlocks,
  emptyInfo,
}: InfoContainerProps) {
    console.log(infoBlocks)
  return (
    <Card className="py-5">
      <CardHeader color="gray" className="mb-4 grid h-16 place-items-center">
        {title}
      </CardHeader>
      {infoBlocks.length === 0 && (
        <div className="flex flex-1 flex-col w-full items-center justify-center px-5">
          <p className="text-lg font-medium">{emptyInfo?.emptyText}</p>
          <Link href={emptyInfo?.buttonLink || '' } className="btn my-2">
            {emptyInfo?.buttonText}
          </Link>
        </div>
      )}
      {infoBlocks.map((block) => {
        return (
          <React.Fragment key={block.title}>
            <div className="flex w-full items-center justify-between px-5">
              <p className="text-lg font-medium">{block.title}</p>
              <Link href={block.link}>
                <IconButton>
                  <BsArrowUpRight />
                </IconButton>
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
    </Card>
  );
}
