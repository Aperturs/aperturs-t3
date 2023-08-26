import { useRouter } from "next/router";
import { useEffect, type ReactElement } from "react";
import { Layout, PostView } from "~/components";
import { useStore } from "~/store/post-store";

export default function Post() {
  const { reset, shouldReset, setShouldReset } = useStore((state) => ({
    reset: state.reset,
    shouldReset: state.shouldReset,
    setShouldReset: state.setShouldReset,
  }));
  const router = useRouter();

  useEffect(() => {
    if (shouldReset) reset();

    setShouldReset(false);

  }, [reset, router, setShouldReset, shouldReset]);

  return (
    <div className="container mx-auto p-4">
      <PostView />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
