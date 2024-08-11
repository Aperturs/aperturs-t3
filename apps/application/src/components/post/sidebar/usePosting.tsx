import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

import type { UpdateYoutubePostInput } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";
import usePost from "../content/use-post";

export default function usePublishing({ id }: { id: string }) {
  const {
    post,
    date,
    reset,
    youtubeContent,
    postType,
    socialProviders,
    shouldReset: isUploaded,
  } = useStore(
    (state) => ({
      post: state.post,
      date: state.date,
      reset: state.reset,
      shouldReset: state.shouldReset,
      youtubeContent: state.youtubeContent,
      postType: state.postType,
      socialProviders: state.socialProviders,
    }),
    shallow,
  );
  const { uploadFilesAndModifyContent, loading: uploadingFiles } = usePost();

  // const {
  //   mutateAsync: createTweet,
  //   error: twitterError,
  //   isPending: tweeting,
  // } = api.twitter.postTweet.useMutation();
  // const {
  //   mutateAsync: createLinkedinPost,
  //   isPending: linkedinPosting,
  //   error: linkedinError,
  // } = api.linkedin.postToLinkedin.useMutation();

  // const {
  //   mutateAsync: updateYoutubePost,
  //   isPending: updatingYoutube,
  //   error: updateYoutubeError,
  // } = api.savepost.updateYoutubePost.useMutation();

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
  const {
    mutateAsync: postByPostId,
    isPending: postByPostIdPending,
    data: postByPostIdData,
  } = api.post.postByPostId.useMutation();

  const { mutateAsync: postToYoutube, isPending: postingToYoutube } =
    api.youtube.postToYoutube.useMutation();

  const { mutateAsync: schedulePost, isPending: scheduling } =
    api.post.schedule.useMutation();

  const { orgid } = useParams<{ orgid: string }>();
  const { user } = useUser();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState("");

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
    // Array to store all promises
    // const promises = content.map(async (item) => {
    //   switch (item.socialType) {
    //     case `${SocialType.Twitter}`:
    //       setLoading(true);
    //       await toast.promise(
    //         createTweet({
    //           tokenId: item.id,
    //           tweets: [
    //             {
    //               id: 0,
    //               text: item.content,
    //             },
    //           ],
    //         }),
    //         {
    //           loading: "Posting to Twitter...",
    //           success: "Posted to Twitter",
    //           error: "Failed to post to Twitter",
    //         },
    //       );
    //       setLoading(false);
    //       break;
    //     case `${SocialType.Linkedin}`:
    //       setLoading(true);
    //       await toast.promise(
    //         createLinkedinPost(item),
    //         {
    //           loading: "Posting to LinkedIn...",
    //           success: "Posted to LinkedIn",
    //           error: "Failed to post to LinkedIn",
    //         },
    //       );
    //       setLoading(false);
    //       break;
    //     case `${SocialType.Youtube}`:
    //       console.log("hey brooo");
    //       setLoading(true);
    //       await toast.promise(handlePostYoutube(), {
    //         loading: "Posting to Youtube...",
    //         success:
    //           "Background processing started for Youtube post, it will be posted soon.",
    //         error: (err) => `Failed to post to Youtube ${err}`,
    //       });
    //       setLoading(false);
    //       break;
    //     default:
    //       console.log("hey brooo");
    //   }
    // });
    // // Wait for all promises to resolve
    // await Promise.all(promises);

    // // After all promises are resolved
    // if (!twitterError || !linkedinError || loading) {
    //   reset();
    // }
    setLoading(true);
    if (postType === "LONG_VIDEO") {
      await toast.promise(handlePostYoutube(), {
        loading: "Posting to Youtube...",
        success:
          "Background processing started for Youtube post, it will be posted soon.",
        error: (err) => `Failed to post to Youtube ${err}`,
      });
      setLoading(false);
      return;
    }

    const postId = await handleSavePost({ isScheduling: false });
    if (!postId) {
      toast.error("post id is not available");
      return;
    }
    await toast
      .promise(postByPostId({ postId }), {
        loading: "Posting to your socials...",
        success: "Posted to your socials",
        error: "Failed to post to social media",
      })
      .then(() => {
        reset();
        redirect("post");
      });
    redirect("post");
  };

  const handlePostYoutube = async () => {
    if (id) {
      let thumbnail = "";
      let thumbnailChanged = false;

      let videoChanged = false;
      if (!youtubeContent.thumbnail.includes("amazonaws.com")) {
        console.log("it dosnt belong to aws");
        if (!youtubeContent.thumbnailFile) {
          throw new Error("Please add a thumbnail");
        }
        const thumbnailFile = youtubeContent.thumbnailFile;

        setUploadingFileName("Uploading thumbnail");
        const k = await uploadFiles(thumbnailFile);
        thumbnailChanged = true;
        if (!k) {
          throw new Error("Failed to upload thumbnail");
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
        setUploadingFileName("Uploading video");
        const k = await uploadFiles(videoFile);
        if (!k) {
          throw new Error("Failed to upload video");
        }
        video = k;
      }
      let data = {
        postId: id,
        description: youtubeContent.videoDescription,
        title: youtubeContent.videoTitle,
        updatedAt: new Date(),
        orgId: orgid ? orgid : undefined,
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
      // await postToYoutube({
      //   ...data,
      //   postId: id,
      //   shouldUpdate: true,
      //   content: content.filter(
      //     (item) =>
      //       item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
      //   ),
      // });
    } else {
      if (!youtubeContent.thumbnailFile) {
        throw new Error("Please add a thumbnail");
      }
      if (!youtubeContent.videoFile) {
        throw new Error("Please add a video");
      }
      const thumbnailFile = youtubeContent.thumbnailFile;
      const videoFile = youtubeContent.videoFile;
      setUploadingFileName("Uploading thumbnail");
      const thumbnail = await uploadFiles(thumbnailFile);
      if (!thumbnail) {
        throw new Error("Failed to upload thumbnail");
      }
      setUploadingFileName("Uploading video");
      const video = await uploadFiles(videoFile);
      if (!video) {
        throw new Error("Failed to upload video");
      }
      const data = {
        description: youtubeContent.videoDescription,
        thumbnail: thumbnail,
        title: youtubeContent.videoTitle,
        updatedAt: new Date(),
        videoTags: youtubeContent.videoTags,
        content: "",
        YoutubeTokenId:
          youtubeContent.youtubeId.length > 0
            ? youtubeContent.youtubeId
            : undefined,
        video: video,
      };
      // await postToYoutube({
      //   shouldUpdate: false,
      //   ...data,
      // });
    }
  };

  const handleSave = async ({ isScheduling }: { isScheduling: boolean }) => {
    if (postType === "NORMAL") {
      return await handleSavePost({ isScheduling });
    }
    // if (postType === "LONG_VIDEO") {
    //   return await handleSaveYoutube();
    // }
  };

  const handleSavePost = async ({
    isScheduling,
  }: {
    isScheduling: boolean;
  }) => {
    let postId = "";
    const scheduledTime = date;
    if (isScheduling && !scheduledTime) {
      toast.error("Please select a date and time");
      return;
    }
    if (!post.content) {
      toast.error("Please add a post content");
      return;
    }
    await toast.promise(
      (async () => {
        // Upload files and modify content
        setUploadingFileName("Uploading files");
        const newContent = await uploadFilesAndModifyContent();
        // Save to drafts
        const response = await saveToDrafts({
          ...post,
          socialProviders: socialProviders,
          scheduledTime:
            isScheduling && scheduledTime ? new Date(scheduledTime) : undefined,
          orgId: orgid,
        });

        if (response.success) {
          if (!isScheduling) {
            reset();
            if (orgid) {
              router.push(`/organisation/${orgid}/drafts`);
            } else {
              router.push("/drafts");
            }
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
    // if (postType === "LONG_VIDEO") {
    //   return await handleUpdateYoutube();
    // }
  };

  // const handleSaveYoutube = async () => {
  //   if (!youtubeContent.thumbnailFile) {
  //     toast.error("Please add a thumbnail");
  //     return;
  //   }
  //   if (!youtubeContent.videoFile) {
  //     toast.error("Please add a video");
  //     return;
  //   }
  //   const thumbnailFile = youtubeContent.thumbnailFile;
  //   const videoFile = youtubeContent.videoFile;
  //   let postId = "";
  //   await toast.promise(
  //     (async () => {
  //       setUploadingFileName("Uploading thumbnail");
  //       const thumbnail = await uploadFiles(thumbnailFile);
  //       if (!thumbnail) {
  //         toast.error("Failed to upload thumbnail");
  //         return;
  //       }
  //       setUploadingFileName("Uploading video");
  //       const video = await uploadFiles(videoFile);
  //       if (!video) {
  //         toast.error("Failed to upload video");
  //         return;
  //       }
  //       // const response = await saveYoutubePost({
  //       //   description: youtubeContent.videoDescription,
  //       //   thumbnail: thumbnail,
  //       //   orgId: orgid,
  //       //   title: youtubeContent.videoTitle,
  //       //   updatedAt: new Date(),
  //       //   videoTags: youtubeContent.videoTags,
  //       //   content: content.filter(
  //       //     (item) =>
  //       //       item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
  //       //   ),
  //       //   YoutubeTokenId:
  //       //     youtubeContent.youtubeId.length > 0
  //       //       ? youtubeContent.youtubeId
  //       //       : undefined,
  //       //   video: video,
  //       // });

  //       // postId = response.data.id;

  //       if (response.success) {
  //         reset();
  //         if (orgid) {
  //           router.push(`/organisation/${orgid}/drafts`);
  //         } else {
  //           router.push("/drafts");
  //         }
  //       }
  //     })(),
  //     {
  //       loading: "Saving to drafts...",
  //       success: "Saved to drafts",
  //       error: (err) => `Failed to save to drafts ${err}`,
  //     },
  //   );
  //   return postId;
  // };

  // const handleUpdateYoutube = async () => {
  //   let postId = "";
  //   await toast.promise(
  //     (async () => {
  //       // Upload files and modify content
  //       // Save to drafts
  //       let thumbnail = "";
  //       let thumbnailChanged = false;

  //       let videoChanged = false;
  //       if (!youtubeContent.thumbnail.includes("amazonaws.com")) {
  //         if (!youtubeContent.thumbnailFile) {
  //           toast.error("Please add a thumbnail");
  //           return;
  //         }
  //         const thumbnailFile = youtubeContent.thumbnailFile;
  //         setUploadingFileName("Uploading thumbnail");
  //         const k = await uploadFiles(thumbnailFile);
  //         thumbnailChanged = true;
  //         if (!k) {
  //           toast.error("Failed to upload thumbnail");
  //           return;
  //         }
  //         thumbnail = k;
  //       }
  //       let video = "";
  //       if (!youtubeContent.videoUrl.includes("amazonaws.com")) {
  //         if (!youtubeContent.videoFile) {
  //           toast.error("Please add a video");
  //           return;
  //         }
  //         const videoFile = youtubeContent.videoFile;
  //         videoChanged = true;
  //         setUploadingFileName("Uploading video");
  //         const k = await uploadFiles(videoFile);
  //         if (!k) {
  //           toast.error("Failed to upload video");
  //           return;
  //         }
  //         video = k;
  //       }
  //       let data = {
  //         postId: id,
  //         description: youtubeContent.videoDescription,
  //         title: youtubeContent.videoTitle,
  //         updatedAt: new Date(),
  //         videoTags: youtubeContent.videoTags,
  //         content: content.filter(
  //           (item) =>
  //             item.socialType === "YOUTUBE" || item.socialType === "DEFAULT",
  //         ),
  //         YoutubeTokenId:
  //           youtubeContent.youtubeId.length > 0
  //             ? youtubeContent.youtubeId
  //             : undefined,
  //       } as UpdateYoutubePostInput;

  //       if (thumbnailChanged) {
  //         data = { ...data, thumbnail: thumbnail };
  //       }
  //       if (videoChanged) {
  //         data = { ...data, video: video };
  //       }
  //       console.log(data, "data");
  //       const response = await updateYoutubePost(data);

  //       postId = response.data.id;
  //       if (response.success) {
  //         reset();
  //         if (orgid) {
  //           router.push(`/organisation/${orgid}/drafts`);
  //         } else {
  //           router.push("/drafts");
  //         }
  //       }
  //     })(),
  //     {
  //       loading: "Updating draft...",
  //       success: "Updated draft",
  //       error: (err) => `Failed to update drafts ${err}`,
  //     },
  //   );
  //   return postId;
  // };

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
          console.log(newContent, "newContent");
          const response = await updatePost({
            ...post,
            socialProviders: socialProviders,
            postId: id,
            scheduledTime:
              isScheduling && scheduledTime
                ? new Date(scheduledTime)
                : undefined,
          });
          if (response.success) {
            if (!isScheduling) {
              reset();
              redirect("drafts");
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`Failed to update post ${err}`);
    }
  };

  const handleSchedule = async () => {
    const scheduledTime = date;
    if (!scheduledTime) {
      return toast.error("Please select a date and time");
    }

    console.log(scheduledTime, "scheduledTime");

    try {
      let postid = "";
      if (isUploaded) {
        await handleUpdate({ isScheduling: true });
        postid = id;
      } else {
        const postId = await handleSave({ isScheduling: true });
        if (!postId) {
          toast.error("post id is not available");
          return;
        }
        postid = postId;
      }
      await toast
        .promise(
          schedulePost({
            id: postid,
            date: scheduledTime,
          }),
          {
            loading: "Scheduling post...",
            success: "Scheduled post",
            error: "Failed to schedule post",
          },
        )
        .then((response) => {
          console.log(response, "before looking for res sch");
          if (response) {
            console.log(response, "res after schedule");
            reset();
            redirect("post");
          }
        });
    } catch (err) {
      toast.error(`Failed to schedule post`);
    }
  };

  const redirect = (endpoint: string) => {
    if (orgid) {
      return router.push(`/organisation/${orgid}/${endpoint}`);
    } else {
      return router.push(`/${endpoint}`);
    }
  };

  return {
    handlePublish,
    handleSave,
    handleUpdate,
    handleSchedule,
    isDisabled:
      !post ||
      uploadingFiles ||
      saving ||
      // linkedinPosting ||
      // tweeting ||
      savingYoutube ||
      gettingPresignedUrl ||
      postingToYoutube ||
      uploadProgress > 0,
    isUploaded,
    disablePosting: socialProviders.length === 0,
    // scheduling,
    uploadingFiles,
    saving,
    updating,
    scheduling,
    // handleSaveYoutube,
    uploadProgress,
    uploadFiles,
    uploadingFileName,
    reset,
  };
}
