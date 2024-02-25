import FetchPersonalSocials from "~/components/profile/connect-socials/personal/fetch-socials";
import ConnectSocials from "~/components/profile/connect-socials/socials";

const SocialsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <ConnectSocials>
        <FetchPersonalSocials />
      </ConnectSocials>
    </div>
  );
};

export default SocialsPage;
