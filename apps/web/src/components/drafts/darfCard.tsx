"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { HiPaperAirplane, HiQueueList } from "react-icons/hi2";
import { IoPencilSharp } from "react-icons/io5";
import { TbTrashFilled } from "react-icons/tb";

import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import { Dialog, DialogTrigger } from "@aperturs/ui/dialog";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

import ConfirmationModal from "~/components/custom/modals/modal";
import { api } from "~/trpc/react";

interface IDarfCard {
  id: string;
  content: string;
  refetch?: () => void;
}

export default function DraftCard({ id, content, refetch }: IDarfCard) {
  const router = useRouter();
  const { mutateAsync: DeleteDraft, isLoading: deleting } =
    api.savepost.deleteSavedPostById.useMutation();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await toast.promise(DeleteDraft({ id }), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Failed to delete",
    });
    refetch?.();
  };

  return (
    <Dialog>
      <Card className="mt-6 ">
        <CardHeader className="relative ">
          <p>Draft</p>
        </CardHeader>
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
        <CardContent>
          <div className="h-20 overflow-auto">
            <p className="whitespace-pre-line">{content}</p>
          </div>
        </CardContent>
        <CardFooter className="grid w-full grid-cols-4 gap-2 pt-0 ">
          {/* <button className="btn btn-primary text-white"
        
        onClick={() => {
            router.push("/post/1");
        }}
        >Edit</button> */}
          <ToolTipSimple content="Edit" duration={30}>
            <Button
              variant="secondary"
              className="btn w-full"
              onClick={() => {
                router.push(`/post/${id}`);
              }}
            >
              <IoPencilSharp />
            </Button>
          </ToolTipSimple>
          <ToolTipSimple content="Comming Soon...">
            <Button variant="secondary" className="btn w-full">
              <HiPaperAirplane />
            </Button>
          </ToolTipSimple>
          <ToolTipSimple content="Comming Soon...">
            <Button variant="secondary" className="w-full">
              <HiQueueList />
            </Button>
          </ToolTipSimple>
          <ToolTipSimple content="Delete draft" duration={30}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                disabled={deleting}
                className="w-full hover:bg-red-600 hover:text-white"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <TbTrashFilled />
              </Button>
            </DialogTrigger>
          </ToolTipSimple>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
