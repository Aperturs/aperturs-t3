import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";
import Picker from "~/components/custom/datepicker/picker";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { api } from "~/utils/api";
import { SimpleButton } from "../common";

function Publish() {
  const { tweets, defaultContent, selectedSocials } = useStore(
    (state) => ({
      tweets: state.tweets,
      defaultContent: state.defaultContent,
      selectedSocials: state.selectedSocials,
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

  const handlePublish = async (tweets: Tweet[], defaultContent: string) => {
    for (const item of selectedSocials) {
      if (!item.id) continue;
      switch (item.type) {
        case `${SocialType.Twitter}`:
          const content = await createTweet({ tokenId: item.id, tweets });
          if (twitterError) {
            toast.error(`Failed to post to Twitter: ${twitterError.message}`);
          } else {
            toast.success("Posted to Twitter");
          }
          break;
        case `${SocialType.Linkedin}`:
          console.log("linkedin trying");
          await createLinkedinPost({
            tokenId: item.id,
            content: defaultContent,
          });
          if (linkedinError) {
            toast.error(`Failed to post to LinkedIn: ${linkedinError.message}`);
          } else {
            toast.success("Posted to Linkedin");
          }
          break;
        default:
          console.log("Unsupported social media type");
      }
    }
  };

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      <div className="grid grid-cols-2 gap-1">
        <Picker />
        <SimpleButton
          text="Schedule"
          disabled={selectedSocials.length === 0}
          onClick={() => {
            console.log("onClick event is triggered");
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
        text="Save"
        onClick={() => {
          console.log("onClick event is triggered");
        }}
      />
      <SimpleButton
        text="Add to Queue"
        onClick={() => {
          console.log("onClick event is triggered");
        }}
        disabled={selectedSocials.length === 0}

      />
    </div>
  );
}

export default Publish;
