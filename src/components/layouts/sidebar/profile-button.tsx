import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Command, CommandItem, CommandList } from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function ProfileButton() {
  //   const user = await currentUser();
  const { user } = useUser();
  console.log(user?.imageUrl, "user");
  const slug = useParams();

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger asChild>
          <Card className="flex w-full cursor-pointer items-center gap-2 border-none bg-secondary p-3">
            <Avatar>
              <AvatarImage
                src={user?.imageUrl || "/user.png"}
                alt="avatar"
                className="rounded-full"
              />
              <AvatarFallback>
                {user?.firstName?.slice(0, 1).toUpperCase()}
                {user?.lastName?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="capitalize">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <LuChevronsUpDown size={16} className="text-muted-foreground" />
            {/* <AvatarFallback>U</AvatarFallback> */}
          </Card>
        </PopoverTrigger>
        <PopoverContent className="z-[200] pt-4">
          <Command>
            <CommandList>
              <CommandItem>
                <Link
                  href={`/dashboard`}
                  className="mx-2 flex h-full w-full gap-4"
                >
                  <Avatar>
                    <AvatarImage
                      src={user?.imageUrl || "/user.png"}
                      alt="avatar"
                      className="rounded-full"
                    />
                    <AvatarFallback>
                      {user?.firstName?.slice(0, 1).toUpperCase()}
                      {user?.lastName?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="capitalize">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </Link>
              </CommandItem>
              <CommandItem>
                <DialogTrigger asChild>
                  <Button
                    className="my-2 flex w-full gap-3"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    <FaPlusCircle className="text-xl" />
                    Create New Organisation
                  </Button>
                </DialogTrigger>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateOrganisationDialog />
    </Dialog>
  );
}

function CreateOrganisationDialog() {
  return (
    <DialogContent>
      <h1>Create Organisation</h1>
    </DialogContent>
  );
}
