import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

export const subjectRoutes = new Elysia({ prefix: "/subjects" })
  // Get all subjects for a tutor
  .get(
    "/",
    async ({ query }) => {
      const subjects = await prisma.subject.findMany({
        where: query.tutorId ? { tutorId: query.tutorId } : undefined,
        include: {
          topics: {
            orderBy: { order: "asc" },
          },
          _count: {
            select: { assignments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return subjects;
    },
    {
      query: t.Object({
        tutorId: t.Optional(t.String()),
      }),
    }
  )

  // Get a single subject by ID
  .get(
    "/:id",
    async ({ params, set }) => {
      const subject = await prisma.subject.findUnique({
        where: { id: params.id },
        include: {
          topics: {
            orderBy: { order: "asc" },
          },
          assignments: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!subject) {
        set.status = 404;
        return { error: "Subject not found" };
      }

      return subject;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Create a new subject
  .post(
    "/",
    async ({ body }) => {
      const subject = await prisma.subject.create({
        data: {
          name: body.name,
          description: body.description,
          icon: body.icon,
          color: body.color,
          tutorId: body.tutorId,
          topics: body.topics
            ? {
                create: body.topics.map((topic, index) => ({
                  name: topic,
                  order: index,
                })),
              }
            : undefined,
        },
        include: {
          topics: true,
        },
      });
      return subject;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        color: t.Optional(t.String()),
        tutorId: t.String(),
        topics: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // Update a subject
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const subject = await prisma.subject.update({
          where: { id: params.id },
          data: {
            name: body.name,
            description: body.description,
            icon: body.icon,
            color: body.color,
          },
          include: {
            topics: true,
          },
        });
        return subject;
      } catch {
        set.status = 404;
        return { error: "Subject not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        color: t.Optional(t.String()),
      }),
    }
  )

  // Delete a subject
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await prisma.subject.delete({
          where: { id: params.id },
        });
        return { success: true };
      } catch {
        set.status = 404;
        return { error: "Subject not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Add a topic to a subject
  .post(
    "/:id/topics",
    async ({ params, body, set }) => {
      try {
        const topicCount = await prisma.topic.count({
          where: { subjectId: params.id },
        });

        const topic = await prisma.topic.create({
          data: {
            name: body.name,
            order: topicCount,
            subjectId: params.id,
          },
        });
        return topic;
      } catch {
        set.status = 404;
        return { error: "Subject not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String({ minLength: 1 }),
      }),
    }
  )

  // Delete a topic
  .delete(
    "/:id/topics/:topicId",
    async ({ params, set }) => {
      try {
        await prisma.topic.delete({
          where: { id: params.topicId },
        });
        return { success: true };
      } catch {
        set.status = 404;
        return { error: "Topic not found" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
        topicId: t.String(),
      }),
    }
  );
