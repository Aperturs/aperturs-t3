import { MenuItem, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCodeBranch } from "react-icons/fa";
import { GiPaperTray } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";

const menuItems = [
  // {
  //   text: "Dashboard",
  //   icon: <RiDashboardFill className="h-5 w-5" />,
  // },
  // {
  //   text: "Analytics",
  //   icon: <SiGoogleanalytics className="h-5 w-5" />,
  // },
  {
    text: "GitHub Commits",
    icon: <FaCodeBranch className="h-5 w-5" />,
    url: "/commits",
  },
  {
    text: "Drafts",
    icon: <GiPaperTray className="h-5 w-5" />,
    url: "/drafts",
  },
  // {
  //   text: "Context",
  //   icon: <LuBrainCircuit className="h-5 w-5" />,
  //   url: "/context",
  // },

  {
    text: "Settings",
    icon: <IoMdSettings className="h-5 w-5" />,
    url: "/settings",
  },
];

export default function NavList({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {menuItems.map(({ text, icon, url }) => (
        <Link href={`/project/${params.id}${url}`} key={text}>
          <Typography variant="small" color="blue-gray" className="font-normal">
            <MenuItem className="flex items-center gap-2 lg:rounded-lg">
              {icon}
              {text}
            </MenuItem>
          </Typography>
        </Link>
      ))}
    </ul>
  );
}
