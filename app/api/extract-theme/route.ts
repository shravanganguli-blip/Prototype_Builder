import { NextRequest, NextResponse } from "next/server";

function darken(hex: string, amount = 0.2): string {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lighten(hex: string, opacity = 0.08): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c * opacity + 255 * (1 - opacity));
  return `#${mix(r).toString(16).padStart(2, "0")}${mix(g).toString(16).padStart(2, "0")}${mix(b).toString(16).padStart(2, "0")}`;
}

function extractColor(html: string): string | null {
  const patterns = [
    /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i,
    /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']msapplication-TileColor["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && /^#[0-9a-fA-F]{3,6}$/.test(match[1].trim())) {
      return match[1].trim();
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(normalized, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PrototypeBuilder/1.0)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const html = await response.text();
    const primary = extractColor(html);

    if (!primary) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      primaryColor: primary,
      secondaryColor: darken(primary, 0.2),
      accentColor: "#F5A623",
      bgLight: lighten(primary, 0.08),
    });
  } catch {
    return NextResponse.json({ found: false });
  }
}
