/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";
import Picker from "~/components/custom/datepicker/picker";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { api } from "~/utils/api";
import { SimpleButton } from "../common";

function Publish() {
  const { tweets, defaultContent, selectedSocials, content, date, time } =
    useStore(
      (state) => ({
        tweets: state.tweets,
        defaultContent: state.defaultContent,
        selectedSocials: state.selectedSocials,
        content: state.content,
        date: state.date,
        time: state.time,
      }),
      shallow
    );
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
    // status: saveStatus,
    // error: saveError,
  } = api.userPost.savePost.useMutation();

  const router = useRouter();

  const handlePublish = async (tweets: Tweet[], defaultContent: string) => {
    for (const item of selectedSocials) {
      const PostContent =
        content.find((post) => post.id === item.id)?.content || defaultContent;
      if (!item.id) continue;
      switch (item.type) {
        case `${SocialType.Twitter}`:
          await createTweet({
            tokenId: item.id,
            tweets: [
              {
                id: 0,
                text: PostContent,
              },
            ],
          });
          if (twitterError) {
            toast.error(`Failed to post to Twitter: ${twitterError.message}`);
          } else {
            toast.success("Posted to Twitter");
          }
          break;
        case `${SocialType.Linkedin}`:
          await createLinkedinPost({
            tokenId: item.id,
            content: PostContent,
          });
          if (linkedinError) {
            toast.error(`Failed to post to LinkedIn: ${linkedinError.message}`);
          } else {
            toast.success("Posted to Linkedin");
          }
          break;
        default:
          toast.error("Please select a social media platform");
      }
    }
  };

  const handleSave = async () => {
    const [hours, minutes] = time.split(":");
    const scheduledTime =
      date && hours !== undefined && minutes !== undefined
        ? new Date(date).setHours(parseInt(hours), parseInt(minutes))
        : undefined;

    if (!defaultContent || !content)
      return toast.error("Please add a post content");
    await toast
      .promise(
        saveToDrafts({
          selectedSocials: selectedSocials.map((social) => ({
            id: social.id,
            type: social.type,
            name: social.name,
          })),
          postContent: content.map((post) => ({
            id: post.id,
            socialType: post.socialType,
            content: post.content,
          })),
          defaultContent: defaultContent,
          scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
        }),
        {
          loading: "Saving to drafts...",
          success: "Saved to drafts",
          error: "Failed to save to drafts",
        }
      )
      .then(async (response) => {
        if (response.success) {
          await router.push("/drafts");
        }
      });
    // console.log(saveStatus);
    // if (saveStatus == "success") {
    //   toast.success("Saved to drafts");
    // }
    // // else {
    // //   toast.error("Failed to save to drafts");
    // // }
    // if (saveError) {
    //   toast.error(`Failed to save to drafts: ${saveError.message}`);
    // }
  };

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      <div className="grid grid-cols-2 gap-1">
        <Picker />
        <SimpleButton
          text="Schedule"
          disabled={selectedSocials.length === 0}
          onClick={() => {
            //
          }}
        />
      </div>
      <SimpleButton
        isLoading={tweeting || linkedinPosting}
        text="Publish Now"
        disabled={selectedSocials.length === 0}
        onClick={async () => {
          await handlePublish(tweets, defaultContent);
        }}
      />
      {/* <PostWeb content={defaultContent} /> */}
      <SimpleButton
        isLoading={saving}
        text="Save to drafts"
        onClick={async () => {
          await handleSave();
        }}
      />
      <SimpleButton
        text="Add to Queue"
        onClick={() => {
          // console.log("onClick event is triggered");
        }}
        disabled={selectedSocials.length === 0}
      />
    </div>
  );
}

export default Publish;
