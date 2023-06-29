export const onLinkedLnConnect = () => {
  console.log(" linkedln Connect");
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process
    .env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!}&redirect_uri=${process.env
    .NEXT_PUBLIC_LINKEDIN_REDIRECT_URL!}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
};
