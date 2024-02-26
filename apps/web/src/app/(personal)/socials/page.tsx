import ConnectSocials from "~/components/profile/socials/socials";
import FetchPersonalSocials from "./fetch-socials";

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
