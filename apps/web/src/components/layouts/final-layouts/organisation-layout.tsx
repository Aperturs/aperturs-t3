import OrgSidebar from "../sidebar/org/org-sidebar";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="relative gap-8 lg:flex">
        <div className="w-full lg:max-w-[18rem]">
          <OrgSidebar />
        </div>
        <div className="relative mt-8 grid w-full items-center px-2 lg:block  lg:p-12">
          {children}
        </div>
      </div>
    </section>
  );
}
