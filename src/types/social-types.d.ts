interface SocialAccounts {
  type: SOCIAL_TYPES;
  data: {
    tokenId: string;
    name: string;
    profile_image_url: string;
    profileId: string;
  };
}
