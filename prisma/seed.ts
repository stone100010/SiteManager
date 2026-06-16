import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "开发工具", icon: "code", color: "#6366f1", sortOrder: 0 },
    { name: "文档中心", icon: "book-open", color: "#8b5cf6", sortOrder: 1 },
    { name: "API 服务", icon: "server", color: "#06b6d4", sortOrder: 2 },
    { name: "监控面板", icon: "activity", color: "#f59e0b", sortOrder: 3 },
    { name: "社交媒体", icon: "share-2", color: "#ec4899", sortOrder: 4 },
    { name: "内部系统", icon: "lock", color: "#10b981", sortOrder: 5 },
    { name: "其他", icon: "layout-grid", color: "#6b7280", sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
