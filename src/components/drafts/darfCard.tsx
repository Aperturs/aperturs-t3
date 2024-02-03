import { Dialog, Tooltip, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { HiPaperAirplane, HiQueueList } from "react-icons/hi2";
import { IoPencilSharp } from "react-icons/io5";
import { TbTrashFilled } from "react-icons/tb";
import ConfirmationModal, {
  type HandleOpenRef,
} from "~/components/custom/modals/modal";
import { api } from "~/utils/api";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

interface IDarfCard {
  id: string;
  content: string;
  refetch: () => void;
}

export default function DraftCard({ id, content, refetch }: IDarfCard) {
  const router = useRouter();
  const { mutateAsync: DeleteDraft, isLoading: deleting } =
    api.savepost.deleteSavedPostById.useMutation();

  const [open, setOpen] = useState(false);

  // const handleDialogOpenRef = useRef<HandleConfirmModalOpen>(null);

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
      <CardHeader className="relative ">
        <Typography>Draft</Typography>
      </CardHeader>
      <Dialog open={open} handler={setOpen}>
        <ConfirmationModal
          DialogBodyContent="Are you sure you want to delete this draft?"
          DialogHeaderContent="Delete Draft"
          onConfirm={() => {
            void handleDelete();
            setOpen(false);
          }}
          onClose={() => {
            toast.success("Your Draft is Safe");
            setOpen(false);
          }}
        />
      </Dialog>
      <CardContent>
        <div className="h-20 overflow-auto">
          <Typography className="whitespace-pre-line">{content}</Typography>
        </div>
      </CardContent>
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
            onClick={() => {
              setOpen(true);
            }}
          >
            <TbTrashFilled />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
