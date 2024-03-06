import Script from "next/script";

import Layout from "~/components/layouts/final-layouts/personal-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="lazyOnload"
      />
      {children}
    </Layout>
  );
}
