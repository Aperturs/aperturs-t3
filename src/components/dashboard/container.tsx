import { Card, CardHeader, IconButton } from "@material-tailwind/react";
import { BsArrowUpRight } from "react-icons/bs";

interface InfoContainerProps {
  title: string;
}

export default function InfoContainer({ title }: InfoContainerProps) {
  return (
    <Card className="py-5">
      <CardHeader color="gray" className="mb-4 grid h-14 place-items-center">
        {title}
      </CardHeader>
      <div className="flex justify-between px-5 items-center">
        <p className="text-lg font-medium">
            some testing text
        </p>
        <IconButton>
           <BsArrowUpRight />
        </IconButton>
      </div>
      <hr className="my-3 mx-5" />
    </Card>
  );
}
