import DraftPage from "~/components/drafts/draft";
import FetchDrafts from "./fetch-drafts";

export default function Drafts() {
  return (
    <div className="relative flex">
      <DraftPage>
        <FetchDrafts />
      </DraftPage>
    </div>
  );
}
