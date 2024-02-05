"use client";

import { useEffect, useState } from "react";
import LogoLoad from "~/components/custom/loading/logoLoad";
import PostView from "~/components/post/postWrapper";
import { useStore } from "~/store/post-store";

export default function PostContent({ params }: { params: { id: string } }) {
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

  return (
    <div className="container mx-auto p-4">
      <PostView params={params} />{" "}
    </div>
  );
}
