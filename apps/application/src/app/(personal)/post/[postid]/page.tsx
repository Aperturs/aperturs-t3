"use client";

import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import LogoLoad from "~/components/custom/loading/logoLoad";
import PostView from "~/components/post/wrappers/post-wrapper";
import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";

export default function Post({ params }: { params: { postid: string } }) {
  // const router = useRouter()

  const { postid } = params;

  const [loading, setLoading] = useState(true);
  const { setContent, setShouldReset, setPostType, setSocialProviders } =
    useStore(
      (state) => ({
        setContent: state.setPost,
        setShouldReset: state.setShouldReset,
        setPostType: state.setPostType,
        content: state.post,
        setSocialProviders: state.setSocialProviders,
      }),
      shallow,
    );

  const getData = api.savepost.getSavedPostById.useQuery(postid);

  const fetchData = useMemo(() => {
    return () => {
      try {
        const data = getData.data;
        if (!data) return;
        setPostType(data.post.postType);
        const localContent = data.post;
        const socials = data.socialProviders;
        setContent(localContent);
        setSocialProviders(socials);
        console.log("localContent", localContent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData.data]);

  useEffect(() => {
    setShouldReset(true);
    fetchData();
    console.log("fetchData done");
    // const timeout = setTimeout(() => {
    //   setLoading(false);
    // }, 3000); // 2-second delay
    setLoading(false);

    return () => {
      // clearTimeout(timeout);
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
