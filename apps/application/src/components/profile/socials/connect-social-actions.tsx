"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreVertical, RefreshCcw, Trash } from "lucide-react";
import toast from "react-hot-toast";

import type { SocialType } from "@aperturs/validators/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@aperturs/ui/alert-dialog";
import { Button } from "@aperturs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@aperturs/ui/dropdown-menu";

import { api } from "~/trpc/react";
import {
  handleLinkedinRedirect,
  handleYoutubeRedirect,
} from "~/utils/actions/handle-socials";

export default function ConnectSocialsAction({
  id,
  type,
}: {
  id: string;
  type: SocialType;
}) {
  const { mutateAsync: removeAccount } =
    api.user.removeSocialAccount.useMutation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const params = useParams<{ orgid: string }>();

  const handleRefreshAccount = async () => {
    if (type === ("TWITTER" as SocialType)) {
      router.push(
        `/socials/twitter?orgid=${params?.orgid ?? "personal"}&tokenid=${id}`,
      );
    }
    if (type === ("LINKEDIN" as SocialType)) {
      await handleLinkedinRedirect({
        orgId: params?.orgid ?? "personal",
        tokenId: id,
      });
    }
    if (type === ("YOUTUBE" as SocialType)) {
      await handleYoutubeRedirect({
        orgId: params?.orgid ?? "personal",
        tokenId: id,
      });
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-3 top-3 h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={handleRefreshAccount}
          >
            <RefreshCcw size={15} />
            Refresh Details
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Trash size={15} /> Remove User
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await toast.promise(
                removeAccount({ socialType: type, tokenId: id }),
                {
                  loading: "Removing Account...",
                  success: "Account Removed",
                  error: "Failed to remove user",
                },
              );
              setLoading(false);
              setTimeout(() => {
                router.refresh();
              }, 2000);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
