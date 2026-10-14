import { NextRequest } from "next/server";

/**
 * Markdown representation of any public page, served by proxy.ts when a
 * client sends `Accept: text/markdown`. It renders the page's own HTML
 * through the normal pipeline and converts the <main> content, so the
 * Markdown can never drift from what browsers see. Unknown paths keep their
 * HTTP 404 and get a Markdown error body pointing at llms.txt and the sitemap.
 */

export const dynamic = "force-dynamic";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
};

const entities: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  "&apos;": "'", "&nbsp;": " ", "&mdash;": "—", "&ndash;": "–", "&middot;": "·",
};

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&[a-z]+;|&#39;/gi, (e) => entities[e.toLowerCase()] ?? e);
}

function htmlToMarkdown(html: string, origin: string): { title: string; body: string } {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  let h = html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html;
  h = h
    .replace(/<(script|style|svg|noscript|template|button|select|textarea|form)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const label = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!label) return "";
      if (/^(#|javascript:)/i.test(href)) return label;
      const abs = href.startsWith("/") ? origin + href : href;
      return `[${label}](${decode(abs)})`;
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) =>
      `\n\n${"#".repeat(Number(n))} ${t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()}\n\n`)
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|ul|ol|header|footer|tr|table|figure|dl)>/gi, "\n\n")
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<[^>]+>/g, "");
  const body = decode(h)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\)\[/g, ") [")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title, body };
}

function notFound(origin: string, path: string) {
  const body = `# 404: page not found

There is no page at \`${path.split("?")[0]}\` on Bombay Cafe Map (${origin}).

Where to look instead:

- [llms.txt](${origin}/llms.txt): a plain-text guide to the site, its scoring model and every scored cafe
- [Sitemap](${origin}/sitemap.xml): every public page
- [Map of Mumbai cafes](${origin}/mumbai): browse and filter all cafes
- [Homepage](${origin}/)
`;
  return new Response(body, { status: 404, headers: HEADERS });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const origin = req.nextUrl.origin;
  const { path: segments = [] } = await ctx.params;
  const path = "/" + segments.map(encodeURIComponent).join("/") + req.nextUrl.search;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return notFound(origin, "/");
  }

  const res = await fetch(origin + path, {
    headers: { Accept: "text/html" },
    redirect: "manual",
    cache: "no-store",
  });

  if (res.status === 404) return notFound(origin, path);
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location") ?? "/";
    return new Response(null, { status: res.status, headers: { ...HEADERS, Location: loc } });
  }
  if (!res.ok) {
    return new Response(`# Error ${res.status}\n\nThis page could not be rendered. See ${origin}/llms.txt.\n`, {
      status: res.status,
      headers: HEADERS,
    });
  }

  const { title, body } = htmlToMarkdown(await res.text(), origin);
  const text = `${/^#\s/.test(body) || !title ? "" : `# ${title}\n\n`}${body}\n\n---\nSource: ${origin}${path}\nSite guide for agents: ${origin}/llms.txt\n`;
  return new Response(text, { status: 200, headers: HEADERS });
}
