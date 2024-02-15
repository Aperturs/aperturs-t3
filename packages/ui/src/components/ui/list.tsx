import React from "react";

import { cn } from "@ui/lib/utils";

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerClassName?: string;
  prefixChildren?: React.ReactNode;
  suffixChildren?: React.ReactNode;
}

export default function ListItem({
  children,
  // prefixChildren,
  // suffixChildren,
  containerClassName,
  ...props
}: ListItemProps) {
  return (
    <div
      className={
        (cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        ),
        containerClassName)
      }
      {...props}
    >
      {children}
    </div>
  );
}
