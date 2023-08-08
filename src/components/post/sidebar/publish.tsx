import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";
import Picker from "~/components/custom/datepicker/picker";
import { useStore } from "~/store/post-store";
import { SocialType } from "~/types/post-enums";
import { api } from "~/utils/api";
import { SimpleButton } from "../common";
import PostWeb from "./lens/postLens";

function Publish() {
  const { tweets, linkedinPost, selectedSocials } = useStore(
    (state) => ({
      tweets: state.tweets,
      linkedinPost: state.linkedinPost,
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

  const handlePublish = async (tweets: Tweet[], linkedinPost: string) => {
    for (const item of selectedSocials) {
      if (!item.id) continue;
      switch (item.type) {
        case `${SocialType.Twitter}`:
          await createTweet({ tokenId: item.id, tweets });
          if (twitterError) {
            toast.error(`Failed to post to Twitter: ${twitterError.message}`);
          } else {
            toast.success("Posted to Twitter");
          }
          break;
        case `${SocialType.Linkedin}`:
          console.log("linkedin trying");
          await createLinkedinPost({ tokenId: item.id, content: linkedinPost });
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
          onClick={() => {
            console.log("onClick event is triggered");
          }}
        />
      </div>
      <SimpleButton
        isLoading={tweeting || linkedinPosting}
        text="Publish Now"
        onClick={async () => {
          await handlePublish(tweets, linkedinPost);
        }}
      />
      <PostWeb content={linkedinPost} />
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
      />
    </div>
  );
}

export default Publish;
