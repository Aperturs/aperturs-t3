import { LampInvite } from "./elevation";
import FetchInvite from "./fetch-invite";

export default function InvitePage({
  params,
}: {
  params: { inviteid: string };
}) {
  return (
    <div className="bg-slate-950">
      <LampInvite>
        <FetchInvite params={params} />
      </LampInvite>
    </div>
  );
}
