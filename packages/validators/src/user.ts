import { z } from "zod";

export const OrganizationUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
  avatarUrl: z.string().optional().default("/profile.jpeg"),
});

export type OrganizationUser = z.infer<typeof OrganizationUserSchema>;

export const UserDetailsSchema = z.object({
  primaryEmail: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  birthday: z.string(),
  profileImageUrl: z.string().default("/profile.jpeg"),
});

export type UserDetails = z.infer<typeof UserDetailsSchema>;
