"use client";

import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import LogoLoad from "~/components/custom/loading/logoLoad";
import PostView from "~/components/post/postWrapper";
import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";

export default function Post({ params }: { params: { id: string } }) {
  // const router = useRouter()

  const { id } = params;
  // const { data, isLoading, error } = api.userPost.getSavedPostById.useQuery(
  //   id as string
  // );
  const [loading, setLoading] = useState(true);
  const { setContent, setShouldReset } = useStore(
    (state) => ({
      setContent: state.setContent,
      setShouldReset: state.setShouldReset,
    }),
    shallow,
  );

  const getData = api.savepost.getSavedPostById.useQuery(id);

  const fetchData = useMemo(() => {
    return () => {
      try {
        console.log("runing fetchData");
        const data = getData.data;
        if (!data) return;
        const localContent = data.content;

        setContent(localContent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData.data]);

  useEffect(() => {
    setShouldReset(true);
    fetchData();
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2-second delay

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchData, setShouldReset]);

  if (loading || getData.isLoading) return <LogoLoad size="24" />;
  if (getData.error) return <div>{getData.error.message}</div>;

  return (
    <div>
      <PostView params={params} />
    </div>
  );
}
