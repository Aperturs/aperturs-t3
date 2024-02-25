import type { OrgIdParams } from "@aperturs/validators/organisation";

import { SocialIcon } from "~/components/profile/connect-socials/add-socials";
import { ConnectedSocial } from "~/components/profile/connect-socials/connected-social";
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
        />
      ))}
    </>
  );
}
