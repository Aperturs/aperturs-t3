import Layout from "~/components/layouts/Layout";

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
