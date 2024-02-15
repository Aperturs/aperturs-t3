import Layout from "~/components/layouts/final-layouts/personal-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ThemeProvider>
    <Layout>{children}</Layout>
    // </ThemeProvider>
  );
}
