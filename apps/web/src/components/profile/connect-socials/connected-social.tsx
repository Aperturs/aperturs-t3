import Image from "next/image";
import { MoreVertical, RefreshCcw, Trash } from "lucide-react";

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
} from "@aperturs/ui/components/ui/alert-dialog";
import { Button } from "@aperturs/ui/components/ui/button";
import { Card } from "@aperturs/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@aperturs/ui/components/ui/dropdown-menu";

export interface IConnection {
  name: string;
  icon: React.ReactNode;
  profilePic: string;
  id: string;
  type: SocialType;
}

export const ConnectedSocial = ({
  name,
  icon,
  profilePic,
  id,
  type,
}: IConnection) => {
  return (
    <Card className="flex w-full items-center justify-between gap-3  px-10 py-6 ">
      <Image
        className="mx-2 h-10 w-10 rounded-full object-cover"
        src={profilePic}
        alt="profile"
        width={40}
        height={40}
      />
      <h2 className="whitespace-nowrap text-sm leading-3 ">{name}</h2>
      {icon}
      <ConnectSocialsAction id={id} type={type} />
    </Card>
  );
};

function ConnectSocialsAction({ id, type }: { id: string; type: SocialType }) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="flex gap-2">
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
            // disabled={loading}
            className="bg-destructive hover:bg-destructive"
            // onClick={async () => {
            //   setLoading(true);
            //   await toast.promise(removeUser({ orgUserId: rowData.id }), {
            //     loading: "Removing User...",
            //     success: "User Removed",
            //     error: "Failed to remove user",
            //   });
            //   setLoading(false);
            //   setTimeout(() => {
            //     router.refresh();
            //   }, 2000);
            // }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
