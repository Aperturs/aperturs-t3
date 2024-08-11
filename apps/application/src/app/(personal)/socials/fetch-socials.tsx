import { SocialIcon } from "~/components/post/common";
import { ConnectedSocial } from "~/components/profile/socials/connected-social";
import { api } from "~/trpc/server";

export default async function FetchPersonalSocials() {
  const data = await api.user.fetchConnectedAccounts();
  return (
    <>
      {data?.map((item, key) => (
        <ConnectedSocial
          key={key}
          name={item.name ?? ""}
          icon={<SocialIcon type={item.socialType} size="md" />}
          profilePic={item.profile_image_url ?? "/user.png"}
          id={item.socialId}
          type={item.socialType}
          connectedAt={item.connectedAt}
          username={item.username}
        />
      ))}
    </>
  );
}
