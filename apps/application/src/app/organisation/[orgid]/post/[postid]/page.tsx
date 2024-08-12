"use client";

import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { PostType } from "@aperturs/validators/post";

import LogoLoad from "~/components/custom/loading/logoLoad";
import PostView from "~/components/post/wrappers/org-post-wrapper";
import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";

export default function Post({ params }: { params: { postid: string } }) {
  // const router = useRouter()

  const { postid } = params;
  // const { data, isLoading, error } = api.userPost.getSavedPostById.useQuery(
  //   id as string
  // );
  const [loading, setLoading] = useState(true);
  const {
    // setContent,
    setShouldReset,
    setYoutubeContent,
    setPostType,
    // content,
  } = useStore(
    (state) => ({
      setShouldReset: state.setShouldReset,
      setYoutubeContent: state.setYoutubeContent,
      setPostType: state.setPostType,
      // content: state.content,
      // setContent: state.setContent,
    }),
    shallow,
  );

  const getData = api.savepost.getSavedPostById.useQuery(postid);

  const fetchData = useMemo(() => {
    return () => {
      try {
        const data = getData.data;
        if (!data) return;
        // setPostType(data.postType as PostType);
        // const localContent = data.content;
        // setContent(localContent);
        // console.log("localContent", localContent);
        // if (data.postType === "LONG_VIDEO") {
        //   setContent(data.content);
        //   setYoutubeContent({
        //     thumbnail: data.thumbnail.url,
        //     name: data.id,
        //     youtubeId: data.YoutubeTokenId ?? "",
        //     videoUrl: data.video.url,
        //     videoTags: data.videoTags,
        //     videoTitle: data.title,
        //     videoDescription: data.description,
        //   });
        // }
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
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 2-second delay

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchData, setShouldReset]);

  if (loading || getData.isLoading) return <LogoLoad size="24" />;
  if (getData.error) return <div>{getData.error.message}</div>;

  return (
    <div>
      <PostView />
    </div>
  );
}
