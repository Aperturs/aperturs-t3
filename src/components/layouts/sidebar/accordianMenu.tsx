import { Typography } from "@material-tailwind/react";
import { AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import React from "react";
import { Accordion, AccordionTrigger } from "~/components/ui/accordion";

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

// export default function AccordionMenu(props: MenuProps) {
//   const { list } = props;

//   const [openItems, setOpenItems] = React.useState<number[]>([1, 2]);
//   const pathName = usePathname();

//   const currentPath = (url: string) => {
//     return url === pathName;
//   };

//   const handleOpen = (value: number) => {
//     if (openItems.includes(value)) {
//       setOpenItems(openItems.filter((item) => item !== value));
//     } else {
//       setOpenItems([...openItems, value]);
//     }
//   };

//   return (
//     <div>
//       {list.map((item, index) => (
//         <Accordion
//           open={openItems.includes(item.open)}
//           icon={
//             <ChevronDownIcon
//               strokeWidth={2.5}
//               className={`mx-auto h-4 w-4 transition-transform ${
//                 openItems.includes(item.open) ? "rotate-180" : ""
//               }`}
//             />
//           }
//           key={index}
//         >
//           <ListItem
//             key={item.open}
//             className="p-0"
//             selected={openItems.includes(item.open)}
//           >
//             <AccordionHeader
//               onClick={() => handleOpen(item.open)}
//               className="border-b-0 p-3"
//             >
//               <ListItemPrefix>{item.icon}</ListItemPrefix>
//               <Typography color="blue-gray" className="mr-auto font-normal">
//                 {item.text}
//               </Typography>
//             </AccordionHeader>
//           </ListItem>
//           <AccordionBody className="py-1">
//             <List className="p-0">
//               {item.items.map((subItem, subIndex) => (
//                 <Link href={subItem.url} key={subIndex}>
//                   <ListItem
//                     className={`${
//                       currentPath(subItem.url)
//                         ? "!bg-primary !text-white !shadow-sm hover:bg-primary hover:text-white"
//                         : ""
//                     }`}
//                   >
//                     <ListItemPrefix>
//                       {subItem.subIcon ? (
//                         subItem.subIcon
//                       ) : (
//                         <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
//                       )}
//                     </ListItemPrefix>
//                     {subItem.subText}
//                   </ListItem>
//                 </Link>
//               ))}
//             </List>
//           </AccordionBody>
//         </Accordion>
//       ))}
//     </div>
//   );
// }

export default function AccordanceMenu(props: MenuProps) {
  return (
    <>
      {props.list.map((item, index) => {
        return (
          <Accordion key={item.text} type="single" collapsible>
            <AccordionItem value={item.text}>
              <AccordionTrigger>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  {item.text}
                </Typography>
                {item.icon}
              </AccordionTrigger>
              <AccordionContent>
                <ul>
                  {item.items.map((subItem, subIndex) => {
                    return (
                      <li key={subIndex}>
                        <a href={subItem.url}>{subItem.subText}</a>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
}
