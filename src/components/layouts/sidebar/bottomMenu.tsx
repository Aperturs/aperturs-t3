import { Chip, ListItem, ListItemPrefix, ListItemSuffix } from '@material-tailwind/react'
import Link from 'next/link'
import React from 'react'
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
  } from "@heroicons/react/24/solid";

import { MdCircleNotifications } from 'react-icons/md';


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
    {
      text: "Logout",
      icon: <PowerIcon className="h-5 w-5" />,
      url: "/logout",
    }
  
  ]

function BottomMenu() {
  return (
    <div>
          {
          bottomMenu.map((item, index) => (
            <div key={index}>
            <Link href={item.url} >
              <ListItem >
              <ListItemPrefix>{item.icon}</ListItemPrefix>
              {item.text}
              {item.suffix && <ListItemSuffix>{item.suffix}</ListItemSuffix>}

              </ListItem>
              </Link>
              </div>

          ))}
    </div>
  )
}

export default BottomMenu
