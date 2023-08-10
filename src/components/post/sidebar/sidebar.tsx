import useLensProfile from "~/hooks/lens-profile";
import { SocialType } from "~/types/post-enums";
import ConnectedAccount from "./connections";
import Publish from "./publish";

const SideBar = () => {
  console.log("mounted");

  const { profile: lensProfile, LensData: profile } = useLensProfile();
  // const { data } = api.user.fetchConnectedAccounts.useQuery();

  return (
    <div className="z-20 w-full rounded-lg bg-white p-4 px-8 shadow-xl  shadow-blue-gray-900/5 lg:fixed lg:right-4   lg:h-[100vh] lg:max-w-[20rem]">
      <div className="my-4 flex flex-grow flex-col justify-end gap-1">
        <h2 className="text-xl">Schedule Post</h2>
        <Publish />
        <span className="my-2 text-xl">Publish Post</span>
        <div className="grid grid-cols-3 place-items-start gap-3">
          {/* {data?.map((item) => (
            <ConnectedAccount
              key={item.data.tokenId}
              name={item.data.name}
              type={item.type}
              profilePic={item.data.profile_image_url || "/user.png"}
              id={item.data.tokenId}
            />
          ))} */}
          {profile && (
            <ConnectedAccount
              id={1}
              name={lensProfile.name}
              type={SocialType.Lens}
              profilePic={lensProfile.imageUrl}
            />
          )}
          <ConnectedAccount
              id={1}
              name="Swaraj"
              type={SocialType.Twitter}
              profilePic={lensProfile.imageUrl}
            />
             <ConnectedAccount
              id={2}
              name="Swaraj"
              type={SocialType.Linkedin}
              profilePic={lensProfile.imageUrl}
            />
             <ConnectedAccount
              id={3}
              name="Swaraj"
              type={SocialType.Twitter}
              profilePic={lensProfile.imageUrl}
            />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
