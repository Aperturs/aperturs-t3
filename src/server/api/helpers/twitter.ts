import { PrismaClient } from "@prisma/client";


export const getAccessToken = async (tokenId: number, prisma: PrismaClient) => {
    const token = await prisma.twitterToken.findUnique({
      where: { id: tokenId },
    });
    if (token) {
      if (token.expires_in && token.refresh_token && token.access_token) {
        if (token.expires_in < new Date()) {
          const bearerToken = Buffer.from(
            `${token.client_id}:${token.client_secret}`
          ).toString("base64");
  
          const response = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: {
              Authorization: `Basic ${bearerToken}`,
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
          });
          const data = await response.json();
          await prisma.twitterToken.update({
            where: {
              id: tokenId,
            },
            data: {
              access_token: data.access_token,
              expires_in: new Date(new Date().getTime() + data.expires_in * 1000),
            },
          });
          return data.access_token;
        } else {
          return token.access_token;
        }
      }
    }
  };