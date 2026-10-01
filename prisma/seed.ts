import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const categories = [
  ["PLC", "plc", "PLC controllers, CPUs, expansion and digital or analog I/O modules."],
  ["HMI", "hmi", "Operator panels, HMI accessories and interface equipment."],
  ["VFD & Drives", "vfd-drives", "Variable frequency drives and motor control products."],
  ["Servo Systems", "servo-systems", "Servo drives, motors and compatible accessories."],
  ["Sensors", "sensors", "Temperature, pressure, proximity, photoelectric sensors and encoders."],
  ["Control Panel Components", "control-panels", "Components for industrial control and electrical panels."],
  ["Industrial Communication", "industrial-communication", "Industrial Ethernet, RS485, Modbus and communication equipment."],
  ["New Machines", "automation-components", "New machines and production equipment for industrial automation applications."],
] as const;
async function main() {
  for (const [name, slug, description] of categories) {
    await prisma.category.upsert({ where: { slug }, update: { name, description, active: true }, create: { name, slug, description } });
  }
  // Retire old catalog entries without deleting products or order history.
  await prisma.category.updateMany({ where: { slug: { in: ["full-armor", "helmets", "shields", "gauntlets"] } }, data: { active: false } });
  const legacy = await prisma.category.findMany({ where: { slug: { in: ["full-armor", "helmets", "shields", "gauntlets"] } }, select: { id: true } });
  if (legacy.length) await prisma.product.updateMany({ where: { categoryId: { in: legacy.map(({ id }) => id) }, status: "ACTIVE" }, data: { status: "ARCHIVED", featured: false } });
  console.log("Industrial automation categories are ready. Legacy products are archived and order history is retained.");
}
main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
