import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (category && category !== "all") {
    where.categoryId = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { url: { contains: search, mode: "insensitive" } },
      { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const sites = await prisma.site.findMany({
    where,
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { sortOrder: "asc" },
  });

  const result = sites.map((site) => ({
    ...site,
    tags: site.tags.map((st) => st.tag),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, url, description, categoryId, tags } = body;

  if (!name || !url || !categoryId) {
    return NextResponse.json(
      { error: "名称、地址和分类为必填项" },
      { status: 400 }
    );
  }

  // Process tags
  const tagConnections = [];
  if (tags && Array.isArray(tags)) {
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      tagConnections.push({ tagId: tag.id });
    }
  }

  const site = await prisma.site.create({
    data: {
      name,
      url,
      description: description || null,
      categoryId,
      tags: {
        create: tagConnections.map((t) => ({ tagId: t.tagId })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json(
    { ...site, tags: site.tags.map((st) => st.tag) },
    { status: 201 }
  );
}
