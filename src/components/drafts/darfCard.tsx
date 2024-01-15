import {
  Card,
  CardBody,
  CardFooter,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { HiPaperAirplane, HiQueueList } from "react-icons/hi2";
import { IoPencilSharp } from "react-icons/io5";
import { TbTrashFilled } from "react-icons/tb";
import { openNotificationDialog } from "~/hooks/useModelConfirmation";
import { api } from "~/utils/api";

interface IDarfCard {
  id: string;
  content: string;
  refetch: () => void;
}

export default function DraftCard({ id, content, refetch }: IDarfCard) {
  const router = useRouter();
  const { mutateAsync: DeleteDraft, isLoading: deleting } =
    api.savepost.deleteSavedPostById.useMutation();

  const handleOpen = () => {
    openNotificationDialog({
      title: "Delete Draft",
      content: (
        <>
          <Typography color="blue-gray">
            Are you sure you want to delete this draft?
          </Typography>
        </>
      ),
      labels: { confirm: "Delete It", cancel: "Close" },
      onCancel: () => console.log("canceled"),
      onConfirm: () => handleDelete(),
    });
  };

  const handleDelete = async () => {
    await toast.promise(DeleteDraft({ id }), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Failed to delete",
    });
    refetch();
  };
  return (
    <Card className="mt-6 ">
      {/* <CardHeader color="blue-gray" className="relative ">
        {id !== "1" && (
          <Image
            src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            alt="img-blur-shadow"
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        )}
      </CardHeader> */}
      <CardBody>
        <div className="h-20 overflow-auto">
          <Typography className="whitespace-pre-line">{content}</Typography>
        </div>
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
        <Tooltip
          content="Comming Soon..."
          className="bg-secondary text-black"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button className="btn w-full">
            <HiPaperAirplane />
          </button>
        </Tooltip>
        <Tooltip
          content="Comming Soon..."
          className="bg-secondary text-black"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button className="btn w-full">
            <HiQueueList />
          </button>
        </Tooltip>
        <div className="tooltip" data-tip="delete">
          <button
            disabled={deleting}
            className="btn w-full hover:bg-red-200"
            onClick={handleOpen}
          >
            <TbTrashFilled />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
