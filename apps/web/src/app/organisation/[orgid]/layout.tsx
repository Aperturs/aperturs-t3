import React from "react";

import OrgLayout from "~/components/layouts/final-layouts/organisation-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OrgLayout>{children}</OrgLayout>;
}
