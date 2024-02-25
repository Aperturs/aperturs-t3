import { AddSocialOrg } from "~/components/profile/connect-socials/organisation/add-socials-org";
import ConnectSocials from "~/components/profile/connect-socials/socials";

const SocialsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ConnectSocials>
        <AddSocialOrg />
      </ConnectSocials>
    </div>
  );
};

export default SocialsPage;
