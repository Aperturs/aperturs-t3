import Picker from "~/components/custom/datepicker/picker";
import { SimpleButton } from "../../common";
import usePublishing from "./usePosting";

function Publish({ params }: { params: { id: string } }) {
  const { id } = params;

  const {
    handlePublish,
    handleSave,
    handleSchedule,
    handleUpdate,
    isDisabled,
    isUploaded,
    linkedinPosting,
    saving,
    tweeting,
    // scheduling,
    updating,
    uploadingFiles,
  } = usePublishing({ id });

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      <div className="grid grid-cols-2 gap-1">
        <Picker />
        <SimpleButton
          text="Schedule"
          // isLoading={scheduling}
          disabled={isDisabled}
          onClick={async () => {
            await handleSchedule();
          }}
        />
      </div>
      <SimpleButton
        isLoading={tweeting || linkedinPosting}
        text="Publish Now"
        disabled={isDisabled}
        onClick={async () => {
          await handlePublish();
        }}
      />
      {/* <PostWeb content={defaultContent} /> */}
      {isUploaded ? (
        <SimpleButton
          text="Update Post"
          isLoading={updating || uploadingFiles}
          disabled={isDisabled}
          onClick={async () => {
            await handleUpdate({ isScheduling: false });
          }}
        />
      ) : (
        <SimpleButton
          isLoading={saving || uploadingFiles}
          text="Save to drafts"
          disabled={isDisabled}
          onClick={async () => {
            await handleSave({ isScheduling: false });
          }}
        />
      )}
      {/* <SimpleButton
        text="Add to Queue"
        
        onClick={() => {
          // console.log("onClick event is triggered");
        }}
        disabled={content.length === 0}
      /> */}
    </div>
  );
}

export default Publish;
