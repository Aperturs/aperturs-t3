import { Plus } from "lucide-react";

import { api } from "~/trpc/server";
import { columns } from "./columns";
import SendInvitation from "./send-invite";
import DataTable from "./table";

interface Props {
  params: { orgid: string };
}

async function TeamPage({ params }: Props) {
  const orgId = params.orgid;

  const team = await api.organisation.team.getOrganisationTeams.query({
    orgId,
  });

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={orgId} />}
      filterValue="name"
      columns={columns}
      data={team}
    ></DataTable>
  );
}

export default TeamPage;
