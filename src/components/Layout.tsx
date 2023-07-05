import { SideBar } from ".";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="relative gap-8 lg:flex">
        <div className="lg:max-w-[18rem] w-full">
        <SideBar />
        </div>
        <div className="mt-8 relative flex w-full justify-center px-2 lg:p-12  lg:block">
          {children}
        </div>
      </div>
    </div>
  );
}
