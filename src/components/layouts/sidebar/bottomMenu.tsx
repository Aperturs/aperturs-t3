import { PowerIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Chip,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import Link from "next/link";

import { OrganizationSwitcher, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { MdCircleNotifications } from "react-icons/md";
import { TbSocial } from "react-icons/tb";

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
    <div>
      <ListItem>
        <OrganizationSwitcher />
      </ListItem>
      {bottomMenu.map((item, index) => (
        <div key={index}>
          <Link href={item.url}>
            <ListItem>
              <ListItemPrefix>{item.icon}</ListItemPrefix>
              {item.text}
              {item.suffix && <ListItemSuffix>{item.suffix}</ListItemSuffix>}
            </ListItem>
          </Link>
        </div>
      ))}
      <ListItem
        onClick={() =>
          signOut()
            .then(async () => {
              await router.push("/sign-in");
              toast.success("Signed Out");
            })
            .catch(() => {
              toast.error("Error Signing Out");
            })
        }
      >
        <ListItemPrefix>
          <PowerIcon className="h-5 w-5" />
        </ListItemPrefix>
        SignOut
      </ListItem>
    </div>
  );
}

export default BottomMenu;
