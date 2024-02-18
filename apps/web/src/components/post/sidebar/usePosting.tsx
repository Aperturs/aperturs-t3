import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";
import { SocialType } from "~/types/post-enums";
import usePost from "../content/use-post";

export default function usePublishing({ id }: { id: string }) {
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    content,
    date,
    time,
    reset,
    shouldReset: isUploaded,
  } = useStore(
    (state) => ({
      content: state.content,
      date: state.date,
      time: state.time,
      reset: state.reset,
      shouldReset: state.shouldReset,
    }),
    shallow,
  );
  const {
    uploadFilesAndModifyContent,
    error: uploadingFilesError,
    loading: uploadingFiles,
  } = usePost();

  const {
    mutateAsync: createTweet,
    error: twitterError,
    isLoading: tweeting,
  } = api.twitter.postTweet.useMutation();
  const {
    mutateAsync: createLinkedinPost,
    isLoading: linkedinPosting,
    error: linkedinError,
  } = api.linkedin.postToLinkedin.useMutation();

  const {
    mutateAsync: saveToDrafts,
    isLoading: saving,
    data: saveData,
    // status: saveStatus,
    // error: saveError,
  } = api.savepost.savePost.useMutation();
  const { mutateAsync: updatePost, isLoading: updating } =
    api.savepost.updatePost.useMutation();

  const { mutateAsync: Schedule, isLoading: scheduling } =
    api.post.schedule.useMutation();

  const router = useRouter();

  const handlePublish = async () => {
    setIsDisabled(true);
    content.forEach(async (item) => {
      switch (item.socialType) {
        case `${SocialType.Twitter}`:
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
          break;
        case `${SocialType.Linkedin}`:
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
          break;
        default:
          toast.error("Please select a social media platform");
      }
    });
    if (!twitterError || !linkedinError) {
      reset();
    }
    setIsDisabled(false);
  };

  const handleSave = async ({ isScheduling }: { isScheduling: boolean }) => {
    setIsDisabled(true);
    let postId = "";
    if (!time) {
      setIsDisabled(false);
      return toast.error("Please select a time");
    }
    const [hours, minutes] = time.split(":");
    const scheduledTime =
      date && hours !== undefined && minutes !== undefined
        ? new Date(date).setHours(parseInt(hours), parseInt(minutes))
        : undefined;
    if (isScheduling && !scheduledTime) {
      setIsDisabled(false);
      return toast.error("Please select a date and time");
    }
    if (!content) {
      setIsDisabled(false);
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
    setIsDisabled(false);
    return postId;
  };

  const handleUpdate = async ({ isScheduling }: { isScheduling: boolean }) => {
    setIsDisabled(true);
    if (!time) {
      setIsDisabled(false);
      return toast.error("Please select a time");
    }
    const [hours, minutes] = time.split(":");
    const scheduledTime =
      date && hours !== undefined && minutes !== undefined
        ? new Date(date).setHours(parseInt(hours), parseInt(minutes))
        : undefined;
    try {
      await toast.promise(
        (async () => {
          // Update post
          console.log("updating files");
          const newContent = await uploadFilesAndModifyContent();
          console.log("files updated", newContent);

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
    setIsDisabled(false);
  };

  const handleSchedule = async () => {
    setIsDisabled(true);
    if (!time) {
      setIsDisabled(false);
      return toast.error("Please select a time");
    }
    const [hours, minutes] = time.split(":");
    const scheduledTime =
      date && hours !== undefined && minutes !== undefined
        ? new Date(date).setHours(parseInt(hours), parseInt(minutes))
        : undefined;

    if (!scheduledTime) {
      setIsDisabled(false);
      return toast.error("Please select a date and time");
    }
    try {
      let id = "";
      if (isUploaded) {
        await handleUpdate({ isScheduling: true });
      } else {
        const postId = await handleSave({ isScheduling: true });
        id = postId;
      }
      console.log(id, "id");
      console.log(saveData, "savedData");
      await toast
        .promise(
          Schedule({
            id: id,
            date: new Date(scheduledTime),
          }),
          {
            loading: "Scheduling post...",
            success: "Scheduled post",
            error: "Failed to schedule post",
          },
        )
        .then((response) => {
          if (response) {
            reset();
            router.push("/post");
          }
        });
    } catch (err) {
      toast.error(`Failed to schedule post`);
    }
    setIsDisabled(false);
  };

  return {
    handlePublish,
    handleSave,
    handleUpdate,
    handleSchedule,
    isDisabled,
  };
}
