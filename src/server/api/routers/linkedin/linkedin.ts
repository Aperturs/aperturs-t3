import { TRPCError } from "@trpc/server";
import { postToLinkedin } from "../../helpers/linkedln";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { postToLinkedInInputSchema } from "../../types";

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
});
