import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const githubProject = createTRPCRouter({
  addProject: protectedProcedure
    .input(
      z.object({
        repoName: z.string(),
        repoDescription: z.string().optional(),
        repoUrl: z.string(),
        repoId: z.string(),
        questionsAnswersJsonString: z.string().optional(),
        commitCount: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          repoName: input.repoName,
          repoDescription: input.repoDescription,
          repoUrl: input.repoUrl,
          repoId: input.repoId,
          questionsAnswersJsonString: input.questionsAnswersJsonString,
          commitCount: input.commitCount,
          user: { connect: { clerkUserId: ctx.currentUser } },
        },
      });
      return project;
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          repoName: z.string().optional(),
          repoDescription: z.string().optional(),
          repoUrl: z.string().optional(),
          repoId: z.string().optional(),
          questionsAnswersJsonString: z.string().optional(),
          commitCount: z.number().positive().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const project = await ctx.prisma.project.update({
        where: { id },
        data,
      });

      return project;
    }),

  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: { clerkUserId: ctx.currentUser },
    });
    return projects;
  }),

  getProject: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input },
      });
      return project;
    }),
});
