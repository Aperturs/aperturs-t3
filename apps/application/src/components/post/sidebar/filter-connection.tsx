import type { SocialAccountsBackend } from "@aperturs/validators/user";
import { SocialType } from "@aperturs/validators/post";

import { useStore } from "~/store/post-store";
import ConnectedAccount from "./connections";

export default function ConnectedAccounts({
  data,
}: {
  data: SocialAccountsBackend | undefined;
}) {
  const { posttype } = useStore((state) => ({
    posttype: state.postType,
  }));

  const filterConnectedAccounts = (
    connectedAccounts?: SocialAccountsBackend,
  ): SocialAccountsBackend => {
    if (!connectedAccounts) return [];

    switch (posttype) {
      case "LONG_VIDEO":
        return connectedAccounts.filter(
          (item) => item.type === SocialType.Youtube,
        );
      case "SHORT":
        return connectedAccounts.filter(
          (item) =>
            item.type === SocialType.Youtube ||
            item.type === SocialType.Instagram,
        );
      case "NORMAL":
        return connectedAccounts.filter(
          (item) =>
            item.type === SocialType.Linkedin ||
            item.type === SocialType.Instagram ||
            item.type === SocialType.Twitter ||
            item.type === SocialType.Facebook,
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
