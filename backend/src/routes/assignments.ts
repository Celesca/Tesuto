import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

export const assignmentRoutes = new Elysia({ prefix: "/assignments" })
  // Get all assignments
  .get(
    "/",
    async ({ query }) => {
      const where: Record<string, unknown> = {};
      
      if (query.tutorId) where.tutorId = query.tutorId;
      if (query.subjectId) where.subjectId = query.subjectId;
      if (query.status) where.status = query.status;

      const assignments = await prisma.assignment.findMany({
        where,
        include: {
          subject: {
            select: { id: true, name: true, icon: true, color: true },
          },
          _count: {
            select: { problems: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return assignments;
    },
    {
      query: t.Object({
        tutorId: t.Optional(t.String()),
        subjectId: t.Optional(t.String()),
        status: t.Optional(t.String()),
      }),
    }
  )

  // Get a single assignment by ID
  .get(
    "/:id",
    async ({ params, set }) => {
      const assignment = await prisma.assignment.findUnique({
        where: { id: params.id },
        include: {
          subject: true,
          problems: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!assignment) {
        set.status = 404;
        return { error: "Assignment not found" };
      }

      return assignment;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create a new assignment
  .post(
    "/",
    async ({ body }) => {
      const assignment = await prisma.assignment.create({
        data: {
          title: body.title,
          description: body.description,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
          status: body.status || "DRAFT",
          tutorId: body.tutorId,
          subjectId: body.subjectId,
          problems: body.problems
            ? {
                create: body.problems.map((problem, index) => ({
                  question: problem.question,
                  answer: problem.answer,
                  difficulty: problem.difficulty || "MEDIUM",
                  order: index,
                  topicId: problem.topicId,
                })),
              }
            : undefined,
        },
        include: {
          subject: true,
          problems: true,
        },
      });
      return assignment;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        status: t.Optional(t.String()),
        tutorId: t.String(),
        subjectId: t.String(),
        problems: t.Optional(
          t.Array(
            t.Object({
              question: t.String(),
              answer: t.Optional(t.String()),
              difficulty: t.Optional(t.String()),
              topicId: t.Optional(t.String()),
            })
          )
        ),
      }),
    }
  )

  // Update an assignment
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const assignment = await prisma.assignment.update({
          where: { id: params.id },
          data: {
            title: body.title,
            description: body.description,
            dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            status: body.status as "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED" | undefined,
          },
          include: {
            subject: true,
            problems: true,
          },
        });
        return assignment;
      } catch {
        set.status = 404;
        return { error: "Assignment not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        status: t.Optional(t.String()),
      }),
    }
  )

  // Delete an assignment
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await prisma.assignment.delete({
          where: { id: params.id },
        });
        return { success: true };
      } catch {
        set.status = 404;
        return { error: "Assignment not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Add problems to an assignment
  .post(
    "/:id/problems",
    async ({ params, body, set }) => {
      try {
        const problemCount = await prisma.problem.count({
          where: { assignmentId: params.id },
        });

        const problems = await prisma.problem.createMany({
          data: body.problems.map((problem, index) => ({
            question: problem.question,
            answer: problem.answer,
            difficulty: (problem.difficulty as "EASY" | "MEDIUM" | "HARD") || "MEDIUM",
            order: problemCount + index,
            assignmentId: params.id,
            topicId: problem.topicId,
          })),
        });

        return { count: problems.count };
      } catch {
        set.status = 404;
        return { error: "Assignment not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        problems: t.Array(
          t.Object({
            question: t.String(),
            answer: t.Optional(t.String()),
            difficulty: t.Optional(t.String()),
            topicId: t.Optional(t.String()),
          })
        ),
      }),
    }
  );
