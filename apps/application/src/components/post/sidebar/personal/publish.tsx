import { DateTimePicker } from "~/components/custom/datepicker/date-time";
import { useStore } from "~/store/post-store";
import { SimpleButton } from "../../common";
import usePublishing from "./usePosting";

function Publish({ params }: { params: { id: string } }) {
  const { id } = params;
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
    tweeting,
    // scheduling,
    updating,
    uploadingFiles,
  } = usePublishing({ id });

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      {/* <Picker /> */}
      <DateTimePicker
        date={date}
        setDate={setDate}
        // key={new Date().getTime()}
      />
      <SimpleButton
        text="Schedule"
        // isLoading={scheduling}
        disabled={isDisabled}
        onClick={async () => {
          await handleSchedule();
        }}
      />
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
    </div>
  );
}

export default Publish;
