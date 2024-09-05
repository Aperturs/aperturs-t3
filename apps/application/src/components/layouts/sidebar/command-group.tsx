import { Command } from "lucide-react";

import { CommandEmpty, CommandInput, CommandList } from "@aperturs/ui/command";

export default function CommandGroup() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="h-[500px] max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {/* {accordanceMenuList.map((item, index) => {
          return (
            <CommandGroup key={index} heading={item.text} className="py-3">
              {item.items.map((subItem) => (
                <CommandItem
                  key={subItem.url}
                  className={`${
                    currentPath(subItem.url) ? "bg-muted " : ""
                  } group my-1 cursor-pointer py-3 `}
                >
                  <Link
                    href={subItem.url}
                    className="flex
                    w-[320px]
                    items-center gap-2 rounded-md transition-all  group-hover:font-semibold  md:w-full"
                  >
                    {subItem.subIcon}
                    <span>{subItem.subText}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })} */}
      </CommandList>
    </Command>
  );
}
