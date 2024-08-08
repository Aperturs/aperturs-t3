import { z } from "zod";

import { SocialTypeSchema } from "./post";

export const OrganizationUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
  avatarUrl: z.string().optional().default("/profile.jpeg"),
  userId: z.string(),
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

export const SocialAccounts = z.array(
  z.object({
    type: SocialTypeSchema,
    data: z.object({
      tokenId: z.string(),
      name: z.string(),
      profile_image_url: z.string(),
      profileId: z.string(),
      connectedAt: z.string().optional(),
      username: z.string().optional(),
    }),
  }),
);

export type SocialAccountsBackend = z.infer<typeof SocialAccounts>;

export const UniqueIdsSchema = z.enum([
  "usr",
  "org",
  "pst",
  "orgusr",
  "orginv",
  "twt",
  "lnk",
  "fb",
  "ig",
  "sub",
  "wbhk",
  "yt",
  "ytc",
  "sp",
]);

export type UniqueIdsType = z.infer<typeof UniqueIdsSchema>;
