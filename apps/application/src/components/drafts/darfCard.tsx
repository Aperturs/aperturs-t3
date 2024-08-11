"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { HiPaperAirplane, HiQueueList } from "react-icons/hi2";
import { IoPencilSharp } from "react-icons/io5";
import { TbTrashFilled } from "react-icons/tb";

import type {
  FullPostType,
  SocialType,
  youtubeContentType,
} from "@aperturs/validators/post";
import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import { Dialog, DialogTrigger } from "@aperturs/ui/dialog";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

import ConfirmationModal from "~/components/custom/modals/modal";
import { api } from "~/trpc/react";
import { SocialIcon } from "../post/common";

interface IDarfCard {
  id: string;
  content: string;
  contentT?: FullPostType;
  youtubeContent?: youtubeContentType;
  refetch?: () => void;
  orgid?: string;
}

export default function DraftCard({
  id,
  content,
  refetch,
  contentT,
  orgid,
  youtubeContent,
}: IDarfCard) {
  const router = useRouter();
  const { mutateAsync: DeleteDraft, isPending: deleting } =
    api.savepost.deleteSavedPostById.useMutation();

  const { mutateAsync: postbyId, isPending: posting } =
    api.post.postByPostId.useMutation();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await toast.promise(DeleteDraft({ id }), {
      loading: "Deleting...",
      success: "Deleted",
      error: "Failed to delete",
    });
    router.refresh();
    refetch?.();
  };

  const handlePost = async () => {
    await toast.promise(postbyId({ postId: id }), {
      loading: "Posting...",
      success: "Posted",
      error: "Failed to post",
    });
    router.refresh();
    refetch?.();
  };

  return (
    <Dialog>
      <Card className="mt-6 ">
        <CardHeader className="relative flex flex-row items-center justify-between">
          <p>Draft</p>
          <div className="flex items-center gap-2">
            {/* {contentT &&
              contentT.length > 0 &&
              contentT?.map((item, index) => (
                <AllSocials
                  key={index}
                  name={item.name}
                  socialType={item.socialType as SocialType}
                />
              ))} */}
          </div>
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
                if (orgid) {
                  router.push(`/organisation/${orgid}/post/${id}`);
                } else {
                  router.push(`/post/${id}`);
                }
                // router.push(`/post/${id}`);
              }}
            >
              <IoPencilSharp />
            </Button>
          </ToolTipSimple>
          <ToolTipSimple content="Post" duration={30}>
            <Button
              disabled={posting}
              variant="secondary"
              className="btn w-full"
              onClick={handlePost}
            >
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

function AllSocials({
  name,
  socialType,
}: {
  name: string;
  socialType: SocialType;
}) {
  return (
    <ToolTipSimple content={name} duration={30}>
      <div className="rounded-full p-2">
        <SocialIcon type={socialType} size="md" />
      </div>
    </ToolTipSimple>
  );
}
