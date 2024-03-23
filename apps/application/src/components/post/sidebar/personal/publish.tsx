import { Card } from "@aperturs/ui/card";

import { DateTimePicker } from "~/components/custom/datepicker/date-time";
import { useStore } from "~/store/post-store";
import { SimpleButton } from "../../common";
import usePublishing from "./usePosting";

function Publish({ params }: { params: { postid: string } }) {
  const { postid } = params;
  const date = useStore((state) => state.date);
  const setDate = useStore((state) => state.setDate);

  const {
    handlePublish,
    handleSave,
    handleSchedule,
    handleUpdate,
    isDisabled,
    isUploaded,
    linkedinPosting,
    saving,
    disablePosting,
    tweeting,
    uploadProgress,
    // scheduling,
    updating,
    uploadingFiles,
  } = usePublishing({ id: postid });

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      {/* <Picker /> */}
      {uploadProgress > 0 && (
        <Card className="p-3">uploading {uploadProgress}%</Card>
      )}
      <DateTimePicker
        date={date}
        setDate={setDate}
        // key={new Date().getTime()}
      />
      <SimpleButton
        text="Schedule"
        // isLoading={scheduling}
        disabled={isDisabled || disablePosting}
        onClick={async () => {
          await handleSchedule();
        }}
      />
      <SimpleButton
        isLoading={tweeting || linkedinPosting}
        text="Publish Now"
        disabled={isDisabled || disablePosting}
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
    </div>
  );
}

export default Publish;
