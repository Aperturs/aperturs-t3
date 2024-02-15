import React from "react";
import { CommandDialog } from "~/components/ui/command";
import { type MenuItem } from "./accordian-menu-type";
import AccordanceMenu from "./command-group";

export function CommandMenu({
  accordanceMenuList,
}: {
  accordanceMenuList: MenuItem[];
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <AccordanceMenu accordanceMenuList={accordanceMenuList} />
    </CommandDialog>
  );
}
