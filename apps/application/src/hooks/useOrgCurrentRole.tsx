import { useOrganization } from "@clerk/nextjs";

import type { OrganisationRole } from "@aperturs/validators/organisation";

export default function useOrgCurrentRole() {
  const { membership } = useOrganization();

  const currentRole = membership?.role
    .toUpperCase()
    .replace("ORG:", "") as OrganisationRole;

  return { currentRole };
}
