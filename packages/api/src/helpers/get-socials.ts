import type { tokens } from "@aperturs/db";
import type { SocialAccountsBackend } from "@aperturs/validators/user";

export function getAccounts(
  socialProviders: tokens.SocialProviderSelectType[],
): SocialAccountsBackend {
  const accounts = socialProviders.map((provider) => {
    return {
      socialId: provider.id,
      name: provider.fullName,
      profile_image_url: provider.profileImage,
      profileId: provider.profileId,
      username: provider.username,
      socialType: provider.socialType,
      connectedAt: provider.createdAt,
    };
  }) as SocialAccountsBackend;

  return accounts;
}
