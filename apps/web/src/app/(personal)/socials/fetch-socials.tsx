import { SocialIcon } from "~/components/profile/connect-socials/add-socials";
import { ConnectedSocial } from "~/components/profile/connect-socials/connected-social";
import { api } from "~/trpc/server";

export default async function FetchPersonalSocials() {
  const data = await api.user.fetchConnectedAccounts();
  return (
    <>
      {data?.map((item, key) => (
        <ConnectedSocial
          key={key}
          name={item.data.name ?? ""}
          icon={<SocialIcon type={item.type} />}
          profilePic={item.data.profile_image_url ?? "/user.png"}
          id={item.data.tokenId}
          type={item.type}
        />
      ))}
    </>
  );
}
