import { AddSocialPersonal } from "~/components/profile/connect-socials/personal/personal-social-connect";
import ConnectSocials from "~/components/profile/connect-socials/socials";

const SocialsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ConnectSocials>
        <AddSocialPersonal />
      </ConnectSocials>
    </div>
  );
};

export default SocialsPage;
