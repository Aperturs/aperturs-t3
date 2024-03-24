import type { OrgIdParams } from "@aperturs/validators/organisation";

import { SocialIcon } from "~/components/profile/socials/add-socials";
import { ConnectedSocial } from "~/components/profile/socials/connected-social";
import { api } from "~/trpc/server";

export default async function FetchOrgSocials({
  params,
}: {
  params: OrgIdParams;
}) {
  const data = await api.organisation.socials.getAllSocials({
    orgId: params?.orgid ?? "",
  });
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
          connectedAt={item.data.connectedAt}
          username={item.data.username}
        />
      ))}
    </>
  );
}
