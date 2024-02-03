import { useEffect, type ReactElement, useState } from "react";
import LogoLoad from "~/components/custom/loading/logoLoad";
import Layout from "~/components/layouts/Layout";
import PostView from "~/components/post/postWrapper";
import { useStore } from "~/store/post-store";

const PostContent = () => {
  const { reset, shouldReset, setShouldReset } = useStore((state) => ({
    reset: state.reset,
    shouldReset: state.shouldReset,
    setShouldReset: state.setShouldReset,
  }));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleReset = () => {
      if (shouldReset) reset();
      console.log("running useEffect");
      setShouldReset(false);
    };

    handleReset();
  }, [reset, setShouldReset, shouldReset]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200); // 2-second delay

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (loading) return <LogoLoad size="24" />;

  return <PostView />;
};

export default function Post() {
  return (
    <div className="container mx-auto p-4">
      <PostContent />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
