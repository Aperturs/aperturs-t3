import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlusCircle } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Command, CommandItem, CommandList } from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";

export default function ProfileButton() {
  const { user } = useUser();
  console.log(user?.imageUrl, "user");

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger>
          <CurrentOrganisation
            avatar={user?.imageUrl || "/user.png"}
            name={`${user?.firstName || ""} ${user?.lastName || ""}`}
            email={user?.primaryEmailAddress?.emailAddress || ""}
          />
        </PopoverTrigger>
        <PopoverContent className="z-[200] pt-4">
          <Command>
            <CommandList>
              <CommandItem className="broder-[1px] my-2 cursor-pointer rounded-md border-border !bg-transparent p-2 text-primary transition-all hover:!bg-muted">
                <Link href={`/agency`} className="flex h-full w-full gap-4">
                  <div className="relative w-16">
                    <Image
                      src="/user.png"
                      alt="Agency Logo"
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    AGENCY NAME
                    <span className="text-muted-foreground">Your Agency</span>
                  </div>
                </Link>
              </CommandItem>
              <DialogTrigger asChild>
                <Button
                  className="my-2 flex w-full gap-3"
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <FaPlusCircle className="text-lg" />
                  Create New Organisation
                </Button>
              </DialogTrigger>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateOrganisationDialog />
    </Dialog>
  );
}

interface CurrentOrganisationProps {
  avatar: string;
  name: string;
  email: string;
}
function CurrentOrganisation({
  avatar,
  name,
  email,
}: CurrentOrganisationProps) {
  return (
    <Card className="flex w-full cursor-pointer items-center gap-2 border-none bg-secondary p-3 text-start">
      <Avatar>
        <AvatarImage src={avatar} alt="avatar" className="rounded-full" />
        <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="capitalize">{name}</h3>
        <p className="text-xs text-gray-500">{email}</p>
      </div>
      <LuChevronsUpDown className="text-base text-muted-foreground" />
      {/* <AvatarFallback>U</AvatarFallback> */}
    </Card>
  );
}

function CreateOrganisationDialog() {
  const {
    mutateAsync: createOrganisation,
    isLoading: creatingOrganisation,
    error,
  } = api.organisation.basics.createOrganisation.useMutation();
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreateOrganisation = async () => {
    await toast
      .promise(createOrganisation({ name }), {
        loading: "Creating Organisation...",
        success: "Organisation Created",
        error: (err) =>
          `Failed to create Organisation ${(err as unknown as string) || ""}`,
      })
      .then((res) => {
        console.log(res, "res");
        router.push(`/organisation/${res.id}/dashboard`);
      });
  };

  return (
    <DialogContent>
      <DialogHeader>Create Organisation</DialogHeader>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Organisation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          disabled={creatingOrganisation}
          onClick={handleCreateOrganisation}
        >
          Create Organisation
        </Button>
      </div>
    </DialogContent>
  );
}
