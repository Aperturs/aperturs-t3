import { ConnectSocial } from "@api/helpers/misc";
import { TRPCError } from "@trpc/server";

import { postToLinkedInInputSchema } from "@aperturs/validators/post";

import { env } from "../../../env";
import { postToLinkedin } from "../../helpers/linkedln";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const linkedin = createTRPCRouter({
  postToLinkedin: protectedProcedure
    .input(postToLinkedInInputSchema)
    .mutation(async ({ input }) => {
      try {
        await postToLinkedin(input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error posting to linkedin",
        });
      }
    }),
  addLinkedln: protectedProcedure.mutation(async ({ ctx }) => {
    const canConnect = await ConnectSocial({ user: ctx.currentUser });
    console.log(canConnect, "canConnect");
    if (canConnect) {
      const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${env.LINKEDIN_CLIENT_ID}&redirect_uri=${env.LINKEDIN_CALLBACK_URL}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
      return { url };
    }
    throw new TRPCError({
      message: "Upgrade to higher plan to connect more Socials",
      code: "FORBIDDEN",
    });
  }),
});
