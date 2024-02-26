import type { OrgIdParams } from "@aperturs/validators/organisation";

import ConnectSocials from "~/components/profile/socials/socials";
import FetchOrgSocials from "./fetch-socials";

const SocialsPage = ({ params }: { params: OrgIdParams }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ConnectSocials>
        <FetchOrgSocials params={params} />
      </ConnectSocials>
    </div>
  );
};

export default SocialsPage;
