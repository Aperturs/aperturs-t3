"use server";

import { auth } from "@clerk/nextjs";

import type { OrganisationRole } from "@aperturs/validators/organisation";

export default async function orgDetailsAction() {
  const { orgRole, organization } = auth();
  const role = orgRole?.toUpperCase().replace("ORG:", "") as OrganisationRole;
  const isAdmin = role === "ADMIN" || role === "OWNER" || !organization;
  const isEditor = role === "EDITOR" || isAdmin;
  const isMember = role === "MEMBER";

  return {
    currentRole: role,
    isAdmin,
    isEditor,
    isMember,
  };
}
