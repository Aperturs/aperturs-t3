import { z } from "zod";

import { desc, eq, schema } from "@aperturs/db";
import { ProjectQnASchema } from "@aperturs/validators/project";

import { limitWrapper } from "../../helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const githubProject = createTRPCRouter({
  addProject: protectedProcedure
    .input(
      z.object({
        repoName: z.string(),
        repoDescription: z.string().optional(),
        repoUrl: z.string(),
        repoId: z.string(),
        questionsAnswersJsonString: z.array(ProjectQnASchema).optional(),
        commitCount: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await limitWrapper(
        () =>
          ctx.db.insert(schema.project).values({
            repoName: input.repoName,
            repoDescription: input.repoDescription,
            repoUrl: input.repoUrl,
            repoId: input.repoId,
            updatedAt: new Date(),
            clerkUserId: ctx.currentUser,
          }),
        ctx.currentUser,
        "projects",
      );
      return project;
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          projectName: z.string().optional(),
          repoDescription: z.string().optional(),
          repoUrl: z.string().optional(),
          repoId: z.string().optional(),
          questionsAnswersJsonString: z.array(ProjectQnASchema).optional(),
          commitCount: z.number().positive().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      // const project = await ctx.prisma.project.update({
      //   where: { id },
      //   data,
      // });

      const [project] = await ctx.db
        .update(schema.project)
        .set(data)
        .where(eq(schema.project.id, id))
        .returning();

      return project;
    }),

  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    // const projects = await ctx.prisma.project.findMany({
    //   where: { clerkUserId: ctx.currentUser },
    // });
    const projects = await ctx.db.query.project.findMany({
      where: eq(schema.project.clerkUserId, ctx.currentUser),
    });

    return projects;
  }),

  getRecentProjects: protectedProcedure.query(async ({ ctx }) => {
    // const projects = await ctx.prisma.project.findMany({
    //   where: { clerkUserId: ctx.currentUser },
    //   orderBy: { createdAt: "desc" },
    //   take: 5,
    // });
    const recentProjects = await ctx.db.query.project.findMany({
      where: eq(schema.project.clerkUserId, ctx.currentUser),
      orderBy: desc(schema.project.createdAt),
      limit: 5,
    });
    return recentProjects;
  }),

  getProject: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // const project = await ctx.prisma.project.findUnique({
      //   where: { id: input },
      // });
      const projectData = await ctx.db.query.project.findFirst({
        where: eq(schema.project.id, input),
      });
      return projectData;
    }),
});
