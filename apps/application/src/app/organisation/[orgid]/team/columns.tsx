"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import type { OrganizationUser } from "@aperturs/validators/user";
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
import { Badge } from "@aperturs/ui/badge";
import { Button } from "@aperturs/ui/button";
import { DialogClose } from "@aperturs/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aperturs/ui/dropdown-menu";
import { cn } from "@aperturs/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aperturs/ui/select";

import CustomModal from "~/components/custom/modals/custom-modal";
import { useModal } from "~/components/custom/modals/modal-provider";
import { api } from "~/trpc/react";

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
          className={cn({
            "bg-emerald-500": role === "OWNER",
            "bg-orange-400": role === "ADMIN",
            "bg-primary": role === "EDITOR",
            "bg-indigo-400": role === "MEMBER",
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
  const { organization } = useOrganization();
  const { setOpen } = useModal();
  const { mutateAsync: removeUser } =
    api.organisation.team.removeUserFromOrganisation.useMutation();
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
          {rowData.role !== "OWNER" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  setOpen(
                    <CustomModal
                      subheading="You can change user roles"
                      title="Edit User Details"
                    >
                      <EditDetails {...rowData} />
                    </CustomModal>,
                  );
                }}
              >
                <Edit size={15} />
                Edit Details
              </DropdownMenuItem>
            </>
          )}
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
            onClick={async () => {
              setLoading(true);
              await toast.promise(removeUser({ orgUserId: rowData.id }), {
                loading: "Removing User...",
                success: "User Removed",
                error: "Failed to remove user",
              });
              await organization?.removeMember(rowData.userId);
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
};

type roles = "ADMIN" | "EDITOR" | "MEMBER";

function EditDetails({
  name,
  email,
  role,
  avatarUrl,
  id,
  userId,
}: OrganizationUser) {
  const { mutateAsync: updateRole } =
    api.organisation.team.changeUserRole.useMutation();
  const router = useRouter();
  const { organization, invitations } = useOrganization();
  const [newRole, setNewRole] = useState<roles>(role as roles);

  const handleRoleChange = async () => {
    await updateRole({ orgUserId: id, newRole });
    await organization?.updateMember({
      role: `org:${newRole.toLowerCase()}`,
      userId,
    });
    router.refresh();
  };

  console.log(invitations, "inv");

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
      <DialogClose asChild>
        <Button
          className="w-full"
          onClick={async () => {
            await toast.promise(handleRoleChange(), {
              loading: "Updating Role...",
              success: "Role Updated",
              error: (err) => `Failed to update role: ${err}`,
            });
          }}
        >
          Change Role
        </Button>
      </DialogClose>
    </div>
  );
}
