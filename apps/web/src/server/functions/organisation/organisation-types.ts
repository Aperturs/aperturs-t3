import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z.string(),
  clerkID: z.string(),
  logo: z.string().optional(),
  category: z.string().optional(),
});

export type CreateOrganisation = z.infer<typeof createOrganisationSchema>;

export const inviteUserToOrganisationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  orgId: z.string(),
  inviterId: z.string(),
  inviterName: z.string(),
  role: z.enum(["ADMIN", "EDITOR", "MEMBER"]),
});

export type InviteUserToOrganisation = z.infer<
  typeof inviteUserToOrganisationSchema
>;

export const sendInvitationViaEmailSchema = z.object({
  invitationId: z.string(),
  userImage: z.string(),
  invitedByName: z.string(),
  teamName: z.string(),
  teamImage: z.string(),
  inviteFromIp: z.string(),
  inviteFromLocation: z.string(),
  userName: z.string(),
  toEmail: z.string(),
});

export type sendInvitationViaEmailType = z.infer<
  typeof sendInvitationViaEmailSchema
>;
