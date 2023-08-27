import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiPaperAirplane, HiQueueList } from "react-icons/hi2";
import { IoPencilSharp } from "react-icons/io5";
import { TbTrashFilled } from "react-icons/tb";

interface IDarfCard {
  id: string;
  content: string;
}

export default function DraftCard({ id, content }: IDarfCard) {
  const router = useRouter();
  return (
    <Card className="mt-6 ">
      <CardHeader color="blue-gray" className="relative ">
        {id !== "1" && (
          <Image
            src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            alt="img-blur-shadow"
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        )}
      </CardHeader>
      <CardBody>
        <Typography>{content}</Typography>
      </CardBody>
      <CardFooter className="grid w-full grid-cols-4 gap-2 pt-0 ">
        {/* <button className="btn btn-primary text-white"
        
        onClick={() => {
            router.push("/post/1");
        }}
        >Edit</button> */}
        <div className="tooltip" data-tip="edit">
          <button
            className="btn w-full"
            onClick={() => {
              router.push(`/post/${id}`);
            }}
          >
            <IoPencilSharp />
          </button>
        </div>
        <div className="tooltip w-auto" data-tip="post now">
          <button className="btn w-full">
            <HiPaperAirplane />
          </button>
        </div>
        <div className="tooltip" data-tip="queue">
          <button className="btn w-full">
            <HiQueueList />
          </button>
        </div>
        <div className="tooltip" data-tip="delete">
          <button className="btn w-full hover:bg-red-200">
            <TbTrashFilled />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
