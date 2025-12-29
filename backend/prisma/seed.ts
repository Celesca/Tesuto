import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a default tutor user
  const tutor = await prisma.user.upsert({
    where: { email: "sarah.johnson@tesuto.edu" },
    update: {},
    create: {
      email: "sarah.johnson@tesuto.edu",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      role: "TUTOR",
    },
  });

  console.log(`✅ Created tutor: ${tutor.name}`);

  // Create Mathematics subject
  const mathSubject = await prisma.subject.upsert({
    where: { id: "math-default" },
    update: {},
    create: {
      id: "math-default",
      name: "Mathematics",
      description: "Core mathematics curriculum including algebra, geometry, and calculus",
      icon: "📐",
      color: "#3B82F6",
      tutorId: tutor.id,
      topics: {
        create: [
          { name: "Algebra", order: 0 },
          { name: "Geometry", order: 1 },
          { name: "Trigonometry", order: 2 },
          { name: "Calculus", order: 3 },
          { name: "Statistics & Probability", order: 4 },
        ],
      },
    },
  });

  console.log(`✅ Created subject: ${mathSubject.name}`);

  // Create Physics subject
  const physicsSubject = await prisma.subject.upsert({
    where: { id: "physics-default" },
    update: {},
    create: {
      id: "physics-default",
      name: "Physics",
      description: "Fundamental physics covering mechanics, thermodynamics, and electromagnetism",
      icon: "⚛️",
      color: "#8B5CF6",
      tutorId: tutor.id,
      topics: {
        create: [
          { name: "Mechanics", order: 0 },
          { name: "Thermodynamics", order: 1 },
          { name: "Electromagnetism", order: 2 },
          { name: "Optics", order: 3 },
          { name: "Waves & Sound", order: 4 },
          { name: "Modern Physics", order: 5 },
        ],
      },
    },
  });

  console.log(`✅ Created subject: ${physicsSubject.name}`);

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
