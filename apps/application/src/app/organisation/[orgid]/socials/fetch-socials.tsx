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
          name={item.name ?? ""}
          icon={<SocialIcon type={item.socialType} />}
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
