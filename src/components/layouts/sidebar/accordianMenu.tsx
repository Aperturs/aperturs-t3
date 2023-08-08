import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface AccordanceProps {
  open: number;
  text: string;
  icon: React.ReactNode;
  items: {
    subText: string;
    subIcon?: React.ReactNode;
    url: string;
  }[];
}

interface MenuProps {
  list: AccordanceProps[];
}

export default function AccordionMenu(props: MenuProps) {
  const { list } = props;

  const [openItems, setOpenItems] = React.useState<number[]>([1, 2]);
  const router = useRouter();

  const currentPath = (url: string) => {
    return url === router.asPath;
  };

  const handleOpen = (value: number) => {
    if (openItems.includes(value)) {
      setOpenItems(openItems.filter((item) => item !== value));
    } else {
      setOpenItems([...openItems, value]);
    }
  };

  return (
    <div>
      {list.map((item, index) => (
        <Accordion
          open={openItems.includes(item.open)}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openItems.includes(item.open) ? "rotate-180" : ""
              }`}
            />
          }
          key={index}
        >
          <ListItem
            key={item.open}
            className="p-0"
            selected={openItems.includes(item.open)}
          >
            <AccordionHeader
              onClick={() => handleOpen(item.open)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>{item.icon}</ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                {item.text}
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              {item.items.map((subItem, subIndex) => (
                <Link href={subItem.url} key={subIndex}>
                  <ListItem
                    className={`${
                      currentPath(subItem.url)
                        ? "!bg-primary !text-white !shadow-sm hover:bg-primary hover:text-white"
                        : ""
                    }`}
                  >
                    <ListItemPrefix>
                      {subItem.subIcon ? (
                        subItem.subIcon
                      ) : (
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      )}
                    </ListItemPrefix>
                    {subItem.subText}
                  </ListItem>
                </Link>
              ))}
            </List>
          </AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
