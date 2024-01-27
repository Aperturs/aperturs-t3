import { Bars2Icon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { IconButton, List, Typography } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsFileCodeFill, BsFillClipboardDataFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import AccordianMenu from "./accordianMenu";
import BottomMenu from "./bottomMenu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Card } from "~/components/ui/card";

const AccordanceMenu = [
  {
    open: 1,
    text: "Dashboard",
    icon: <MdSpaceDashboard className="h-5 w-5" />,
    items: [
      {
        subText: "Home",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/dashboard",
      },
      {
        subText: "New Post",
        url: "/post",
      },
      {
        subText: "Queue",
        url: "/queue",
      },
    ],
  },
  {
    open: 2,
    text: "Content",
    icon: <BsFillClipboardDataFill className="h-5 w-5" />,
    items: [
      {
        subText: "Drafts",
        url: "/drafts",
      },
      {
        subText: "Ideas",
        url: "/ideas",
      },
    ],
  },

  {
    open: 3,
    text: "Projects",
    icon: <BsFileCodeFill className="h-5 w-5" />,
    items: [
      {
        subText: "Connected Projects",
        subIcon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
        url: "/project",
      },
    ],
  },
];

export default function SideBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  const pathName = usePathname();

  useEffect(() => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  }, [pathName]);

  return (
    <Card className="mt-2 w-full overflow-scroll p-4 shadow-md lg:fixed lg:left-4  lg:h-[calc(100vh-2rem)] lg:max-w-[18rem]">
      <div className="mb-2 flex items-center gap-4 p-4">
        <Image
          src="/logo.svg"
          alt="brand"
          className="h-8 w-8"
          width={8}
          height={8}
        />
        <Typography variant="h5" color="blue-gray">
          Aperturs
        </Typography>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
      </div>
      <div className="hidden lg:block">
        <List>
          <AccordianMenu list={AccordanceMenu} />
          <hr className="border-blue-gray-50 my-2" />
          <BottomMenu />
        </List>
      </div>
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-scroll"
          >
            <List>
              <AccordianMenu list={AccordanceMenu} />
              <hr className="border-blue-gray-50 my-2" />
              <BottomMenu />
            </List>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <UpgradeAlert /> */}
    </Card>
  );
}
