import { ScrollArea } from "@aperturs/ui/scroll-area";

import { SidebarComponent } from "../sidebar/sidebar-comp";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative h-full gap-8 md:flex">
      <div className="sticky top-0 z-50">
        <SidebarComponent />
      </div>
      <div className="relative mt-8 grid w-full items-center px-2 md:block  md:p-12">
        <ScrollArea className="h-[calc(100vh-10rem)]">{children}</ScrollArea>
      </div>
    </section>
  );
}
