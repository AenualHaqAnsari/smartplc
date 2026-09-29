const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  console.table(categories);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
