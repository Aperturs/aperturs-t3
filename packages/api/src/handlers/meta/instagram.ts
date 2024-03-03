import { env } from "../../../env";

function encodeURL(url: string): string {
  // Splitting the URL by "?" to encode the query parameters separately
  const [baseURL, queryParams] = url.split("?");

  if (!queryParams) return url; // If there are no query parameters, return the original URL

  // Encoding each query parameter separately
  const encodedQueryParams = queryParams.split("&").map((param) => {
    const [key, value] = param.split("=");
    return `${encodeURIComponent(key!)}=${encodeURIComponent(value!)}`;
  });

  // Joining the encoded query parameters back together
  const encodedQueryString = encodedQueryParams.join("&");

  // Returning the encoded URL
  return `${baseURL}?${encodedQueryString}`;
}

export function getInstagramRedirectUrl() {
  const url = encodeURL(`https://www.facebook.com/v19.0/dialog/oauth?
  client_id=${env.FACEBOOK_CLIENT_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&
  redirect_uri=${env.FACEBOOK_CALLBACK_URL}/&response_type=token&scope=
  instagram_basic,instagram_content_publish,instagram_manage_comments,
  instagram_manage_insights,pages_show_list,
  pages_read_engagement;`);

  return url;
}
