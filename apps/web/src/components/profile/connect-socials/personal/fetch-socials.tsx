import { api } from "~/trpc/server";
import { ConnectedSocial } from "../connected-social";
import { SocialIcon } from "./personal-social-connect";

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
        />
      ))}
    </>
  );
}
