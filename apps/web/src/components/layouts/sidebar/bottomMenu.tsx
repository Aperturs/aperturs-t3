import { useClerk } from "@clerk/nextjs";
import { PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { type BottomMenuItem } from "./accordian-menu-type";

function BottomMenu({ bottomMenu }: { bottomMenu: BottomMenuItem[] }) {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {/* <CommandItem>
            <OrganizationSwitcher />
          </CommandItem> */}
          {bottomMenu.map((item, index) => (
            <CommandItem key={index} className="my-1 py-3">
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
          <CommandItem className="cursor-pointer py-3">
            <div
              className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full"
              onClick={(e) => {
                e.preventDefault();
                console.log("signing out");
                signOut()
                  .then(() => {
                    router.push("/sign-in");
                    toast.success("Signed Out");
                  })
                  .catch(() => {
                    toast.error("Error Signing Out");
                  });
              }}
            >
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
