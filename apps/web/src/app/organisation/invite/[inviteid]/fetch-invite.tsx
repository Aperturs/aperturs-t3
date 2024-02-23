import { api } from "~/trpc/server";
import InviteCard from "./invite-card";

export default async function FetchInvite({
  params,
}: {
  params: { inviteid: string };
}) {
  const inviteId = params.inviteid;

  const invite = await api.organisation.team.getInviteDetails({
    inviteId,
  });
  console.log(invite, "invite");

  if (!invite || invite === null) {
    return (
      <div>
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-3xl">
          Sorry Invite not found
        </h1>
      </div>
    );
  }

  if (invite.inviteDetails.status !== "PENDING") {
    return (
      <div>
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-3xl">
          Sorry Invite has been{" "}
          {invite.inviteDetails.status.toLocaleLowerCase()}
        </h1>
      </div>
    );
  }

  return (
    <InviteCard
      name={invite.inviteDetails?.name || ""}
      organisationName={invite.orgDetails?.name ?? ""}
      organisationLogo={invite.orgDetails?.logo ?? "/profile.jpeg"}
      orgId={invite.orgDetails?.id ?? ""}
      inviteId={invite.inviteDetails?.id || ""}
      role={invite.inviteDetails?.role || ""}
      email={invite.inviteDetails?.email || ""}
    />
  );
}
