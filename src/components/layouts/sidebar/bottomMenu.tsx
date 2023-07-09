import {
  Chip,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import Link from "next/link";
import React from "react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

import { MdCircleNotifications } from "react-icons/md";
import { useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

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
    text: "Settings",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    url: "/settings",
  },
];

function BottomMenu() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div>
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
            .then(() => {
              router.push("/");
              toast.success("Signed Out");
            })
            .catch((e) => {
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
