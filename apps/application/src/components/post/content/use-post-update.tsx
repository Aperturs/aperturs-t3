/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FullPostType, MediaType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";

function usePostUpdate(orderId: number, socialId?: string) {
  const { setPost, post } = useStore(
    (state) => ({
      post: state.post,
      setPost: state.setPost,
    }),
    shallow,
  );

  const [sync, setSync] = useState(false);

  const updateContent = useCallback(
    (newContent: string) => {
      if (socialId) {
        const updatedPost = {
          ...post,
          alternativeContent: post.alternativeContent.map((item) =>
            item.socialProvider.socialId === socialId
              ? {
                  ...item,
                  content: item.content.map((contentItem) =>
                    contentItem.order === orderId
                      ? {
                          ...contentItem,
                          text: newContent ?? contentItem.text,
                        }
                      : contentItem,
                  ),
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      } else {
        const updatedPost = {
          ...post,
          content: post.content.map((item) =>
            item.order === orderId
              ? {
                  ...item,
                  text: newContent,
                }
              : item,
          ),
        } as FullPostType;
        console.log(updatedPost, "updated post");
        setPost(updatedPost);
      }
    },
    [socialId, post, setPost, orderId],
  );

  const onRemoveTweet = useCallback(() => {
    if (socialId) {
      const updatedPost = {
        ...post,
        alternativeContent: post.alternativeContent.map((item) =>
          item.socialProvider.socialId === socialId
            ? {
                ...item,
                content: item.content.filter((_, i) => i !== orderId),
              }
            : item,
        ),
      } as FullPostType;
      setPost(updatedPost);
    } else {
      const updatedPost = {
        ...post,
        content: post.content.filter((_, i) => i !== orderId),
      } as FullPostType;
      setPost(updatedPost);
    }
  }, [socialId, post, orderId]);

  const addTweet = useCallback(() => {
    if (socialId) {
      const updatedPost = {
        ...post,
        alternativeContent: post.alternativeContent.map((item) =>
          item.socialProvider.socialId === socialId
            ? {
                ...item,
                content: [
                  ...item.content,
                  {
                    text: "",
                    media: [],
                    name: "DEFAULT",
                    order: item.content.length,
                    socialType: "DEFAULT",
                    tags: [],
                  },
                ],
              }
            : item,
        ),
      } as FullPostType;
      setPost(updatedPost);
    } else {
      const updatedPost = {
        ...post,
        content: [
          ...post.content,
          {
            text: "",
            media: [],
            name: "DEFAULT",
            order: post.content.length,
            socialType: "DEFAULT",
            tags: [],
          },
        ],
      } as FullPostType;
      setPost(updatedPost);
    }
  }, [socialId, post]);

  const updateMedia = useCallback(
    (media: Optional<MediaType, "bucketKey" | "bucketUrl">[]) => {
      if (socialId) {
        const updatedPost = {
          ...post,
          alternativeContent: post.alternativeContent.map((item) =>
            item.socialProvider.socialId === socialId
              ? {
                  ...item,
                  content: item.content.map((contentItem) =>
                    contentItem.order === orderId
                      ? {
                          ...contentItem,
                          media: media,
                        }
                      : contentItem,
                  ),
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      } else {
        const updatedPost = {
          ...post,
          content: post.content.map((item) =>
            item.order === orderId
              ? {
                  ...item,
                  media: media,
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socialId, post, orderId],
  );

  const removeFiles = useCallback(
    (index: number) => {
      if (socialId) {
        const updatedPost = {
          ...post,
          alternativeContent: post.alternativeContent.map((item) =>
            item.socialProvider.socialId === socialId
              ? {
                  ...item,
                  content: item.content.map((contentItem) =>
                    contentItem.order === orderId
                      ? {
                          ...contentItem,
                          files: contentItem.media.filter(
                            (_, i) => i !== index,
                          ),
                        }
                      : contentItem,
                  ),
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      } else {
        const updatedPost = {
          ...post,
          content: post.content.map((item) =>
            item.order === orderId
              ? {
                  ...item,
                  files: item.media.filter((_, i) => i !== index),
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socialId, post, orderId],
  );

  const contentValue = useMemo(() => {
    if (socialId) {
      return (
        post.alternativeContent
          .find((item) => item.socialProvider.socialId === socialId)
          ?.content.find((item) => item.order === orderId)?.text ?? ""
      );
    }
    return post.content.find((item) => item.order === orderId)?.text ?? "";
  }, [socialId, orderId, post]);

  return {
    contentValue,
    updateContent,
    updateMedia,
    removeFiles,
    sync,
    setSync,
    onRemoveTweet,
    addTweet,
    // currentFiles,
    // removeUpdatedFiles,
  };
}

export default usePostUpdate;
