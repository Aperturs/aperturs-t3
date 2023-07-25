import { useRouter } from "next/router";
import { useEffect, type ReactElement } from "react";
import { Layout, PostView } from "~/components";
import { useStore } from "~/store/post-store";

export default function Post() {
  const reset = useStore((state) => state.reset);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      reset();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [reset, router]);

  return (
    <div className="container mx-auto p-4">
      <PostView id={1} />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
