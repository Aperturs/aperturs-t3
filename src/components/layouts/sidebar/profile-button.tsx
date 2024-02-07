import { useUser } from "@clerk/nextjs";
import { Dialog } from "@radix-ui/react-dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function ProfileButton() {
  //   const user = await currentUser();
  const { user } = useUser();
  console.log(user?.imageUrl, "user");

  return (
    <Dialog>
      <Popover>
        <PopoverTrigger asChild>
          <Card className="flex w-full gap-2 border-none bg-secondary py-5">
            <Avatar>
              <AvatarImage>
                {user?.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <AvatarFallback>U</AvatarFallback>
                )}
              </AvatarImage>
              {/* <AvatarFallback>U</AvatarFallback> */}
            </Avatar>
          </Card>
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </Dialog>
  );
}
