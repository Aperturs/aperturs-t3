import { Plus } from "lucide-react";

import { api } from "~/trpc/server";
import { columns } from "./columns";
import SendInvitation from "./send-invite";
import DataTable from "./table";

interface Props {
  params: { orgid: string };
}

async function MembersTable({ params }: Props) {
  const orgId = params.orgid;

  const team = await api.organisation.team.getOrganisationTeams({
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

export default MembersTable;
