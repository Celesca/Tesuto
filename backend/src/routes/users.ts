import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma";

export const userRoutes = new Elysia({ prefix: "/users" })
  // Get or create user (for mock login bypass)
  .post(
    "/auth",
    async ({ body }) => {
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: body.email,
            name: body.name,
            avatar: body.avatar,
            role: body.role || "TUTOR",
          },
        });
      }

      return user;
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        name: t.String({ minLength: 1 }),
        avatar: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
    }
  )

  // Get user by ID
  .get(
    "/:id",
    async ({ params, set }) => {
      const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
          _count: {
            select: {
              subjects: true,
              assignments: true,
            },
          },
        },
      });

      if (!user) {
        set.status = 404;
        return { error: "User not found" };
      }

      return user;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Get all users (for admin)
  .get("/", async () => {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            subjects: true,
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  });
