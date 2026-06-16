import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { sites: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, icon, color } = body;

  if (!name) {
    return NextResponse.json({ error: "分类名称为必填项" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      icon: icon || "folder",
      color: color || "#6366f1",
    },
  });

  return NextResponse.json(category, { status: 201 });
}
