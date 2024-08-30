import { Card } from "@aperturs/ui/card";

import { DateTimePicker } from "~/components/custom/datepicker/date-time";
import { useStore } from "~/store/post-store";
import { api } from "~/trpc/react";
import { SimpleButton } from "../../common";
import usePostUpdate from "../../content/use-post-update";
import usePublishing from "../usePosting";

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
    saving,
    posting,
    disablePosting,
    uploadProgress,
    scheduling,
    updating,
    uploadingFiles,
    uploadingFileName,
  } = usePublishing({ id: postid });

  const { updateContent } = usePostUpdate(0);

  const { mutateAsync: generatePost, isPending } =
    api.linkedinAi.generateLinkedinPostWithoutIdeas.useMutation();

  const handlePostGeneration = async () => {
    const res = await generatePost();
    console.log(res, "res");
    updateContent(res.text);
  };

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      {/* <Picker /> */}
      {uploadProgress > 0 && (
        <Card className="p-3">
          {uploadingFileName.current} {uploadProgress}%
        </Card>
      )}
      <DateTimePicker
        date={date}
        setDate={setDate}
        // key={new Date().getTime()}
      />

      {date ? (
        <SimpleButton
          text="Schedule"
          isLoading={scheduling}
          disabled={isDisabled || disablePosting}
          onClick={async () => {
            await handleSchedule();
          }}
        />
      ) : (
        <SimpleButton
          isLoading={posting}
          text="Publish Now"
          disabled={isDisabled || disablePosting}
          onClick={async () => {
            await handlePublish();
          }}
        />
      )}
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
      <SimpleButton
        text="Generate Post"
        disabled={isPending}
        onClick={handlePostGeneration}
        isLoading={isPending}
      />
    </div>
  );
}

export default Publish;
