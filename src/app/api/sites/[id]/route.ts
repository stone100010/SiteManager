import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const site = await prisma.site.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!site) {
    return NextResponse.json({ error: "站点不存在" }, { status: 404 });
  }

  return NextResponse.json({ ...site, tags: site.tags.map((st) => st.tag) });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, url, description, categoryId, tags, sortOrder } = body;

  // Process tags if provided
  if (tags && Array.isArray(tags)) {
    // Delete existing tag connections
    await prisma.siteTag.deleteMany({ where: { siteId: id } });

    // Create new tag connections
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      await prisma.siteTag.create({
        data: { siteId: id, tagId: tag.id },
      });
    }
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (url !== undefined) data.url = url;
  if (description !== undefined) data.description = description || null;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;

  const site = await prisma.site.update({
    where: { id },
    data,
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json({ ...site, tags: site.tags.map((st) => st.tag) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.site.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
