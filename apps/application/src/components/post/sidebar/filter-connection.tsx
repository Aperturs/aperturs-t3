import type { SocialAccountsBackend } from "@aperturs/validators/user";
import { SocialTypes } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import ConnectedAccount from "./connections";

export default function ConnectedAccounts({
  data,
}: {
  data: SocialAccountsBackend | undefined;
}) {
  const { postType } = useStore((state) => ({
    postType: state.postType,
  }));

  const filterConnectedAccounts = (
    connectedAccounts?: SocialAccountsBackend,
  ): SocialAccountsBackend => {
    if (!connectedAccounts) return [];

    switch (postType) {
      case "LONG_VIDEO":
        return connectedAccounts.filter(
          (item) => item.type === SocialTypes.YOUTUBE,
        );
      case "SHORT":
        return connectedAccounts.filter(
          (item) =>
            item.type === SocialTypes.YOUTUBE ||
            item.type === SocialTypes.INSTAGRAM,
        );
      case "NORMAL":
        return connectedAccounts.filter(
          (item) =>
            item.type === SocialTypes.LINKEDIN ||
            item.type === SocialTypes.INSTAGRAM ||
            item.type === SocialTypes.TWITTER ||
            item.type === SocialTypes.FACEBOOK,
        );
      default:
        return [];
    }
  };

  const filteredAccounts = filterConnectedAccounts(data);

  if (!filteredAccounts || filteredAccounts.length === 0)
    return <p className="w-full text-center">No accounts found</p>;

  return (
    <div className="grid grid-cols-3 place-items-start gap-3">
      {filteredAccounts.map((item) => (
        <ConnectedAccount
          key={item.data.tokenId}
          name={item.data.name ?? ""}
          type={item.type}
          profilePic={item.data.profile_image_url ?? "/user.png"}
          id={item.data.tokenId}
        />
      ))}
    </div>
  );
}
