import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

import type { UpdateYoutubePostInput } from "@aperturs/validators/post";
import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";
import usePost from "../../content/use-post";

export default function usePublishing({ id }: { id: string }) {
  const {
    content,
    date,
    reset,
    youtubeContent,
    postType,
    shouldReset: isUploaded,
  } = useStore(
    (state) => ({
      content: state.content,
      date: state.date,
      reset: state.reset,
      shouldReset: state.shouldReset,
      youtubeContent: state.youtubeContent,
      postType: state.postType,
    }),
    shallow,
  );
  const { uploadFilesAndModifyContent, loading: uploadingFiles } = usePost();

  const {
    mutateAsync: createTweet,
    error: twitterError,
    isPending: tweeting,
  } = api.twitter.postTweet.useMutation();
  const {
    mutateAsync: createLinkedinPost,
    isPending: linkedinPosting,
    error: linkedinError,
  } = api.linkedin.postToLinkedin.useMutation();

  const {
    mutateAsync: updateYoutubePost,
    isPending: updatingYoutube,
    error: updateYoutubeError,
  } = api.savepost.updateYoutubePost.useMutation();

  const { mutateAsync: getPresignedUrl, isPending: gettingPresignedUrl } =
    api.post.getPresignedUrl.useMutation();

  const {
    mutateAsync: saveToDrafts,
    isPending: saving,
    data: saveData,
    // status: saveStatus,
    // error: saveError,
  } = api.savepost.savePost.useMutation();
  const { mutateAsync: updatePost, isPending: updating } =
    api.savepost.updatePost.useMutation();

  const { mutateAsync: saveYoutubePost, isPending: savingYoutube } =
    api.savepost.saveYoutubePost.useMutation();

  const { mutateAsync: postToYoutube, isPending: postingToYoutube } =
    api.youtube.postToYoutube.useMutation();

  const { orgid } = useParams<{ orgid: string }>();
  const { user } = useUser();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async (acceptedFile: File) => {
    let filekey = "";
    try {
      const id = orgid ?? user?.id ?? "";
      filekey = `${id}/youtube/${acceptedFile.name}`;
      const res = await getPresignedUrl({
        filekey,
        fileType: acceptedFile.type,
      });
      await axios.put(res.uploadUrl, acceptedFile, {
        headers: {
          "Content-Type": acceptedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / (progressEvent.total ?? 1)) * 100,
          );
          setUploadProgress(progress);
        },
      });
      return res.fileKey;
    } catch (error) {
      console.error("Failed to upload file:", error);
      return;
    }
  };

  const handlePublish = async () => {
    content.forEach(async (item) => {
      switch (item.socialType) {
        case `${SocialType.Twitter}`:
          setLoading(true);
          await toast.promise(
            createTweet({
              tokenId: item.id,
              tweets: [
                {
                  id: 0,
                  text: item.content,
                },
              ],
            }),
            {
              loading: "Posting to Twitter...",
              success: "Posted to Twitter",
              error: "Failed to post to Twitter",
            },
          );
          setLoading(false);
          break;
        case `${SocialType.Linkedin}`:
          setLoading(true);
          await toast.promise(
            createLinkedinPost({
              tokenId: item.id,
              content: item.content,
            }),
            {
              loading: "Posting to LinkedIn...",
              success: "Posted to LinkedIn",
              error: "Failed to post to LinkedIn",
            },
          );
          setLoading(false);
          break;
        case `${SocialType.Youtube}`:
          console.log("hey brooo");
          setLoading(true);
          await toast.promise(handlePostYoutube(), {
            loading: "Posting to Youtube...",
            success: "Posted to Youtube",
            error: (err) => `Failed to post to Youtube ${err}`,
          });
          setLoading(false);
          break;
        default:
          console.log("hey brooo");
      }
    });
    if (!twitterError || !linkedinError || loading) {
      reset();
    }
    router.push("/post");
  };

  const handlePostYoutube = async () => {
    if (id) {
      let thumbnail = "";
      let thumbnailChanged = false;

      let videoChanged = false;
      if (!youtubeContent.thumbnail.includes("amazonaws.com")) {
        if (!youtubeContent.thumbnailFile) {
          toast.error("Please add a thumbnail");
          return;
        }
        const thumbnailFile = youtubeContent.thumbnailFile;
        const k = await uploadFiles(thumbnailFile);
        thumbnailChanged = true;
        if (!k) {
          toast.error("Failed to upload thumbnail");
          return;
        }
        thumbnail = k;
      }
      let video = "";
      if (!youtubeContent.videoUrl.includes("amazonaws.com")) {
        if (!youtubeContent.videoFile) {
          toast.error("Please add a video");
          return;
        }
        const videoFile = youtubeContent.videoFile;
        videoChanged = true;
        const k = await uploadFiles(videoFile);
        if (!k) {
          toast.error("Failed to upload video");
          return;
        }
        video = k;
      }
      let data = {
        postId: id,
        description: youtubeContent.videoDescription,
        title: youtubeContent.videoTitle,
        updatedAt: new Date(),
        videoTags: youtubeContent.videoTags,

        YoutubeTokenId:
          youtubeContent.youtubeId.length > 0
            ? youtubeContent.youtubeId
            : undefined,
      } as UpdateYoutubePostInput;

      if (thumbnailChanged) {
        data = { ...data, thumbnail: thumbnail };
      }
      if (videoChanged) {
        data = { ...data, video: video };
      }
      await postToYoutube({
        postId: id,
        shouldUpdate: true,
        ...date,
        content: content.filter(
          (item) =>
            item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
        ),
      });
    }
    {
      if (!youtubeContent.thumbnailFile) {
        toast.error("Please add a thumbnail");
        return;
      }
      if (!youtubeContent.videoFile) {
        toast.error("Please add a video");
        return;
      }
      const thumbnailFile = youtubeContent.thumbnailFile;
      const videoFile = youtubeContent.videoFile;

      const thumbnail = await uploadFiles(thumbnailFile);
      if (!thumbnail) {
        toast.error("Failed to upload thumbnail");
        return;
      }
      const video = await uploadFiles(videoFile);
      if (!video) {
        toast.error("Failed to upload video");
        return;
      }
      const data = {
        description: youtubeContent.videoDescription,
        thumbnail: thumbnail,
        title: youtubeContent.videoTitle,
        updatedAt: new Date(),
        videoTags: youtubeContent.videoTags,
        content: content.filter(
          (item) =>
            item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
        ),
        YoutubeTokenId:
          youtubeContent.youtubeId.length > 0
            ? youtubeContent.youtubeId
            : undefined,
        video: video,
      };
      await postToYoutube({
        shouldUpdate: false,
        ...data,
      });
    }
  };

  const handleSave = async ({ isScheduling }: { isScheduling: boolean }) => {
    if (postType === "NORMAL") {
      return await handleSavePost({ isScheduling });
    }
    if (postType === "LONG_VIDEO") {
      console.log("here");
      return await handleSaveYoutube();
    }
  };

  const handleSavePost = async ({
    isScheduling,
  }: {
    isScheduling: boolean;
  }) => {
    let postId = "";
    const scheduledTime = date;
    if (isScheduling && !scheduledTime) {
      return toast.error("Please select a date and time");
    }
    if (!content) {
      return toast.error("Please add a post content");
    }

    await toast.promise(
      (async () => {
        // Upload files and modify content
        const newContent = await uploadFilesAndModifyContent();
        // Save to drafts
        const response = await saveToDrafts({
          postContent: newContent,
          scheduledTime:
            isScheduling && scheduledTime ? new Date(scheduledTime) : undefined,
        });

        if (response.success) {
          if (!isScheduling) {
            reset();
            router.push("/drafts");
          }
          postId = response.data;
        }
      })(),
      {
        loading: "Saving to drafts...",
        success: "Saved to drafts",
        error: "Failed to save to drafts",
      },
    );

    return postId;
  };

  const handleUpdate = async ({ isScheduling }: { isScheduling: boolean }) => {
    if (postType === "NORMAL") {
      return await handleUpdatePost({ isScheduling });
    }
    if (postType === "LONG_VIDEO") {
      return await handleUpdateYoutube();
    }
  };

  const handleSaveYoutube = async () => {
    if (!youtubeContent.thumbnailFile) {
      toast.error("Please add a thumbnail");
      return;
    }
    if (!youtubeContent.videoFile) {
      toast.error("Please add a video");
      return;
    }
    const thumbnailFile = youtubeContent.thumbnailFile;
    const videoFile = youtubeContent.videoFile;
    let postId = "";
    await toast.promise(
      (async () => {
        const thumbnail = await uploadFiles(thumbnailFile);
        if (!thumbnail) {
          toast.error("Failed to upload thumbnail");
          return;
        }
        const video = await uploadFiles(videoFile);
        if (!video) {
          toast.error("Failed to upload video");
          return;
        }
        const response = await saveYoutubePost({
          description: youtubeContent.videoDescription,
          thumbnail: thumbnail,
          title: youtubeContent.videoTitle,
          updatedAt: new Date(),
          videoTags: youtubeContent.videoTags,
          content: content.filter(
            (item) =>
              item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
          ),
          YoutubeTokenId:
            youtubeContent.youtubeId.length > 0
              ? youtubeContent.youtubeId
              : undefined,
          video: video,
        });

        postId = response.data.id;

        if (response.success) {
          reset();
          router.push("/drafts");
        }
      })(),
      {
        loading: "Saving to drafts...",
        success: "Saved to drafts",
        error: (err) => `Failed to save to drafts ${err}`,
      },
    );
    return postId;
  };

  const handleUpdateYoutube = async () => {
    let postId = "";
    await toast.promise(
      (async () => {
        // Upload files and modify content
        // Save to drafts
        let thumbnail = "";
        let thumbnailChanged = false;

        let videoChanged = false;
        if (!youtubeContent.thumbnail.includes("amazonaws.com")) {
          if (!youtubeContent.thumbnailFile) {
            toast.error("Please add a thumbnail");
            return;
          }
          const thumbnailFile = youtubeContent.thumbnailFile;
          const k = await uploadFiles(thumbnailFile);
          thumbnailChanged = true;
          if (!k) {
            toast.error("Failed to upload thumbnail");
            return;
          }
          thumbnail = k;
        }
        let video = "";
        if (!youtubeContent.videoUrl.includes("amazonaws.com")) {
          if (!youtubeContent.videoFile) {
            toast.error("Please add a video");
            return;
          }
          const videoFile = youtubeContent.videoFile;
          videoChanged = true;
          const k = await uploadFiles(videoFile);
          if (!k) {
            toast.error("Failed to upload video");
            return;
          }
          video = k;
        }
        let data = {
          postId: id,
          description: youtubeContent.videoDescription,
          title: youtubeContent.videoTitle,
          updatedAt: new Date(),
          videoTags: youtubeContent.videoTags,
          content: content.filter(
            (item) =>
              item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
          ),
          YoutubeTokenId:
            youtubeContent.youtubeId.length > 0
              ? youtubeContent.youtubeId
              : undefined,
        } as UpdateYoutubePostInput;

        if (thumbnailChanged) {
          data = { ...data, thumbnail: thumbnail };
        }
        if (videoChanged) {
          data = { ...data, video: video };
        }
        console.log(data, "data");
        const response = await updateYoutubePost(data);
        // const response = await updateYoutubePost({
        //   description: youtubeContent.videoDescription,
        //   thumbnail: thumbnail,
        //   title: youtubeContent.videoTitle,
        //   updatedAt: new Date(),
        //   videoTags: youtubeContent.videoTags,
        //   content: content.filter(
        //     (item) =>
        //       item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
        //   ),
        //   YoutubeTokenId:
        //     youtubeContent.youtubeId.length > 0
        //       ? youtubeContent.youtubeId
        //       : undefined,
        //   video: video,
        // });
        postId = response.data.id;
        if (response.success) {
          reset();
          router.push("/drafts");
        }
      })(),
      {
        loading: "Updating draft...",
        success: "Updated draft",
        error: (err) => `Failed to update drafts ${err}`,
      },
    );
    return postId;
  };

  const handleUpdatePost = async ({
    isScheduling,
  }: {
    isScheduling: boolean;
  }) => {
    const scheduledTime = date;
    try {
      await toast.promise(
        (async () => {
          // Update post
          const newContent = await uploadFilesAndModifyContent();
          const response = await updatePost({
            postId: id,
            postContent: newContent,
            scheduledTime:
              isScheduling && scheduledTime
                ? new Date(scheduledTime)
                : undefined,
          });
          if (response.success) {
            if (!isScheduling) {
              reset();
              router.push("/drafts");
              console.log(response, "response");
            }
          }
        })(),
        {
          loading: `${
            isScheduling
              ? "saving and is getting ready to schedule"
              : "Updating post..."
          }`,
          success: `${
            isScheduling ? "saved and is ready to schedule" : "Updated post"
          }`,
          error: `Failed to update post`,
        },
      );
    } catch (err) {
      toast.error(`Failed to update post ${err as string}`);
    }
  };

  const handleSchedule = async () => {
    const scheduledTime = date;
    if (!scheduledTime) {
      return toast.error("Please select a date and time");
    }
    try {
      let id = "";
      if (isUploaded) {
        await handleUpdate({ isScheduling: true });
      } else {
        const postId = await handleSave({ isScheduling: true });
        if (!postId) {
          toast.error("post id is not available");
          return;
        }
        id = postId;
      }
      console.log(id, "id");
      console.log(saveData, "savedData");
      // await toast
      //   .promise(
      //     Schedule({
      //       id: id,
      //       date: new Date(scheduledTime),
      //     }),
      //     {
      //       loading: "Scheduling post...",
      //       success: "Scheduled post",
      //       error: "Failed to schedule post",
      //     },
      //   )
      //   .then((response) => {
      //     if (response) {
      //       reset();
      //       router.push("/post");
      //     }
      //   });
    } catch (err) {
      toast.error(`Failed to schedule post`);
    }
  };

  return {
    handlePublish,
    handleSave,
    handleUpdate,
    handleSchedule,
    isDisabled:
      !content ||
      uploadingFiles ||
      saving ||
      linkedinPosting ||
      tweeting ||
      savingYoutube ||
      gettingPresignedUrl ||
      updatingYoutube ||
      postingToYoutube ||
      uploadProgress > 0,
    isUploaded,
    disablePosting: content.length < 2,
    // scheduling,
    linkedinPosting,
    tweeting,
    uploadingFiles,
    saving,
    updating,
    handleSaveYoutube,
    uploadProgress,
    uploadFiles,
  };
}
