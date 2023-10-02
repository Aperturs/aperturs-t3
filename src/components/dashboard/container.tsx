import { Card, CardHeader, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";

interface SingleInfoProps {
  title: string;
  link: string;
}

interface InfoContainerProps {
  title: string;
  infoBlocks: SingleInfoProps[];
}

export default function InfoContainer({
  title,
  infoBlocks,
}: InfoContainerProps) {
  return (
    <Card className="py-5">
      <CardHeader color="gray" className="mb-4 grid h-14 place-items-center">
        {title}
      </CardHeader>
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
