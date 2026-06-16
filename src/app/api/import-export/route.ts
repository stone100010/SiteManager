import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") || "json";

  const sites = await prisma.site.findMany({
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { sortOrder: "asc" },
  });

  const data = sites.map((site) => ({
    ...site,
    tags: site.tags.map((st) => st.tag.name),
  }));

  if (format === "csv") {
    const header = "name,url,category,description,tags,status\n";
    const rows = data
      .map(
        (s) =>
          `"${s.name}","${s.url}","${s.category.name}","${s.description || ""}","${s.tags.join(",")}","${s.status}"`
      )
      .join("\n");
    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=sites.csv",
      },
    });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sites: { name: string; url: string; categoryId: string; description?: string; tags?: string[] }[] = body.sites;

  if (!Array.isArray(sites)) {
    return NextResponse.json({ error: "数据格式错误" }, { status: 400 });
  }

  let imported = 0;
  for (const s of sites) {
    if (!s.name || !s.url || !s.categoryId) continue;

    const tagConnections = [];
    if (s.tags && Array.isArray(s.tags)) {
      for (const tagName of s.tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        tagConnections.push({ tagId: tag.id });
      }
    }

    await prisma.site.create({
      data: {
        name: s.name,
        url: s.url,
        description: s.description || null,
        categoryId: s.categoryId,
        tags: { create: tagConnections },
      },
    });
    imported++;
  }

  return NextResponse.json({ imported });
}
