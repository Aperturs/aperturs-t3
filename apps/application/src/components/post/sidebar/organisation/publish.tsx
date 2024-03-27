import { Card } from "@aperturs/ui/card";

import { DateTimePicker } from "~/components/custom/datepicker/date-time";
import useOrgCurrentRole from "~/hooks/useOrgCurrentRole";
import { useStore } from "~/store/post-store";
import { SimpleButton } from "../../common";
import usePublishing from "../usePosting";

export default function OrgPublish({
  params,
}: {
  params: { postid: string; orgid: string };
}) {
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
    tweeting,
    disablePosting,
    // scheduling,
    updating,
    uploadingFiles,
    uploadProgress,
    uploadingFileName,
  } = usePublishing({ id: postid });

  const { isAdmin } = useOrgCurrentRole();

  return (
    <div className="my-4 flex w-full flex-col justify-end gap-1">
      {uploadProgress > 0 && (
        <Card className="p-3">
          {uploadingFileName} {uploadProgress}%
        </Card>
      )}
      {isAdmin && (
        <>
          <DateTimePicker date={date} setDate={setDate} />
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
        </>
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
    </div>
  );
}
