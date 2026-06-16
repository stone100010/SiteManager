import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  const sites = await prisma.site.findMany({
    select: { id: true, url: true },
  });

  const results: { id: string; status: "online" | "offline" }[] = [];

  for (const site of sites) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(site.url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const status = res.ok || res.type === "opaque" ? "online" : "offline";
      results.push({ id: site.id, status });
    } catch {
      results.push({ id: site.id, status: "offline" });
    }
  }

  for (const r of results) {
    await prisma.site.update({
      where: { id: r.id },
      data: { status: r.status, lastCheckedAt: new Date() },
    });
  }

  return NextResponse.json({ checked: results.length, results });
}

export async function GET() {
  const status = await prisma.site.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return NextResponse.json(status);
}
