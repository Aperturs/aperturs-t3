import ConnectSocials from "~/components/profile/socials/socials";
import Controls from "./controls";
import FetchPersonalSocials from "~/app/(personal)/socials/fetch-socials";

function AddSocial() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="w-[75%]">
        <div className="flex flex-col items-center justify-center">
          <ConnectSocials>
            <FetchPersonalSocials />
          </ConnectSocials>
        </div>
        <Controls />
      </div>
    </div>
  );
}

export default AddSocial;
