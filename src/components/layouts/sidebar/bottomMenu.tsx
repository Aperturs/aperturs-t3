import { OrganizationSwitcher, useClerk } from "@clerk/nextjs";
import { PowerIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Chip } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdCircleNotifications } from "react-icons/md";
import { TbSocial } from "react-icons/tb";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

const bottomMenu = [
  {
    text: "Notifications",
    icon: <MdCircleNotifications className="h-5 w-5" />,
    suffix: (
      <Chip
        value="14"
        size="sm"
        variant="ghost"
        color="blue-gray"
        className="rounded-full"
      />
    ),
    url: "/notifications",
  },
  {
    text: "Profile",
    icon: <UserCircleIcon className="h-5 w-5" />,
    url: "/profile",
  },
  {
    text: "Socials",
    icon: <TbSocial className="h-5 w-5" />,
    url: "/socials",
  },
];

function BottomMenu() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Command>
      <CommandList>
        <CommandGroup>
          <CommandItem>
            <OrganizationSwitcher />
          </CommandItem>
          {bottomMenu.map((item, index) => (
            <CommandItem key={index} className="my-1">
              <Link
                href={item.url}
                className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full"
              >
                {item.icon}
                <span>{item.text}</span>
                {item.suffix}
              </Link>
            </CommandItem>
          ))}
          <CommandItem
            onClick={() =>
              signOut()
                .then(() => {
                  router.push("/sign-in");
                  toast.success("Signed Out");
                })
                .catch(() => {
                  toast.error("Error Signing Out");
                })
            }
          >
            <div className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full">
              <PowerIcon className="h-5 w-5" />
              <span>SignOut</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default BottomMenu;
