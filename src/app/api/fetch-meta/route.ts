import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL 为必填项" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: "无法访问该网站" }, { status: 400 });
    }

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract meta description
    const descMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    );
    const description = descMatch ? descMatch[1].trim() : "";

    // Extract og:image for preview
    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    const ogImage = ogImageMatch ? ogImageMatch[1].trim() : "";

    // Extract favicon
    const faviconMatch = html.match(
      /<link[^>]+rel=["'](icon|shortcut icon)[""][^>]+href=["']([^"']+)["']/i
    );
    let favicon = "";
    if (faviconMatch) {
      const faviconHref = faviconMatch[2];
      if (faviconHref.startsWith("http")) {
        favicon = faviconHref;
      } else {
        try {
          const u = new URL(url);
          favicon = `${u.origin}${faviconHref.startsWith("/") ? "" : "/"}${faviconHref}`;
        } catch {
          favicon = "";
        }
      }
    }
    if (!favicon) {
      try {
        const u = new URL(url);
        favicon = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
      } catch {
        favicon = "";
      }
    }

    return NextResponse.json({ title, description, ogImage, favicon });
  } catch (e) {
    return NextResponse.json(
      { error: "抓取失败：" + (e instanceof Error ? e.message : "未知错误") },
      { status: 400 }
    );
  }
}
