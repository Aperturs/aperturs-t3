"use client";

import { type ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "~/components/custom/modals/custom-modal";
import { useModal } from "~/components/custom/modals/modal-provider";
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
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { type OrganizationUser } from "~/types/user-type";

export const columns: ColumnDef<OrganizationUser>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: () => {
      return null;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const avatarUrl: string = row.getValue("avatarUrl");
      return (
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11 flex-none">
            <Image
              src={avatarUrl || "/profile.jpeg"}
              fill
              className="rounded-full object-cover"
              alt="avatar image"
            />
          </div>
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "avatarUrl",
    header: "",
    cell: () => {
      return null;
    },
  },
  { accessorKey: "email", header: "Email" },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role: string = row.getValue("role");
      return (
        <Badge
          className={clsx({
            "bg-emerald-500": role === "AGENCY_OWNER",
            "bg-orange-400": role === "AGENCY_ADMIN",
            "bg-primary": role === "SUBACCOUNT_USER",
            "bg-muted": role === "SUBACCOUNT_GUEST",
          })}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

interface CellActionsProps {
  rowData: OrganizationUser;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setOpen } = useModal();
  if (!rowData) return;
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={async () => {
              await navigator.clipboard.writeText(rowData?.email);
              toast.success("Email copied to clipboard");
            }}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DialogTrigger asChild> */}
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  subheading="You can change user roles"
                  title="Edit User Details"
                >
                  {/* <UserDetails
                        type="agency"
                        id={rowData?.Agency?.id || null}
                        subAccounts={rowData?.Agency?.SubAccount}
                      /> */}
                  <EditDetails {...rowData} />
                </CustomModal>,
                // async () => {
                //   return { user: await getUser(rowData?.id) };
                // }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          {/* </DialogTrigger> */}
          {rowData.role !== "OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
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
            onClick={() => {
              setLoading(true);
              // await deleteUser(rowData.id);
              // toast({
              //   title: "Deleted User",
              //   description:
              //     "The user has been deleted from this agency they no longer have access to the agency",
              // });
              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type roles = "ADMIN" | "EDITOR" | "MEMBER";

function EditDetails({ name, email, role, avatarUrl, id }: OrganizationUser) {
  const { mutateAsync: updateRole } =
    api.organisation.team.changeUserRole.useMutation();

  const [newRole, setNewRole] = useState<roles>(role as roles);

  return (
    <div>
      <div className="flex items-center gap-4 p-2">
        <div className="relative h-20 w-20 flex-none">
          <Image
            src={avatarUrl || "/profile.jpeg"}
            fill
            className="rounded-full object-cover"
            alt="avatar image"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="text-sm text-muted-foreground">{email}</span>
          <Select
            defaultValue={role}
            onValueChange={(value) => {
              setNewRole(value as roles);
            }}
          >
            <SelectTrigger className="my-2 w-[180px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="OWNER">OWNER</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={async () => {
          await toast.promise(updateRole({ orgUserId: id, newRole }), {
            loading: "Updating Role...",
            success: "Role Updated",
            error: "Failed to update role",
          });
        }}
      >
        Change Role
      </Button>
    </div>
  );
}
