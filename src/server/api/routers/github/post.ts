import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AIGenerated } from "../../helpers/ai";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const githubPost = createTRPCRouter({
  generatePost: protectedProcedure
    .input(
      z.object({
        ProjectName: z.string(),
        ProjectContext: z.string(),
        ProjectDescription: z.string(),
        CommitInformation: z.string(),
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const data = await AIGenerated({
          ProjectName: input.ProjectName,
          ProjectContext: input.ProjectContext,
          ProjectDescription: input.ProjectDescription,
          CommitInformation: input.CommitInformation,
          website: input.website,
        });
        return {
          data: data,
          success: true,
          message: "post generated successfully",
          code: 200,
        };
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
