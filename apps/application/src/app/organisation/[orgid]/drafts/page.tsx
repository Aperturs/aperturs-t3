import DraftPage from "~/components/drafts/draft";
import FetchOrgDrafts from "./fetch-org-drafts";

// import FetchDrafts from "./fetch-drafts";

export default function OrgDraftPage({
  params,
}: {
  params: { orgid: string };
}) {
  return (
    <div className="relative flex">
      <DraftPage>
        <FetchOrgDrafts params={params} />
      </DraftPage>
    </div>
  );
}
