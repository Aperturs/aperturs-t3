import { useCallback, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import type { FullPostType, MediaType, SocialType } from "@aperturs/validators/post";
import { SocialTypes } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { tweetsHere } from "../common";

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
                  media: item.media.map((mediaItem) => ({
                    ...mediaItem,
                  })),
                }
              : item,
          ),
        } as FullPostType;
        setPost(updatedPost);
      }
    },
    [socialId, post, setPost, orderId],
  );

  const updateMedia = useCallback(
    (media: Optional<MediaType,"bucketKey" | "bucketUrl">[]) => {
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
    // currentFiles,
    // removeUpdatedFiles,
  };
}

export default usePostUpdate;
