import { NextRequest, NextResponse } from "next/server";

/**
 * The only thing gating the review queue from the public internet. No
 * accounts system exists (or is warranted) for a single reviewer, so this
 * is deliberately just HTTP Basic Auth against two env vars rather than a
 * built-out auth stack.
 */
/**
 * True when the client's Accept header ranks text/markdown at least as high
 * as text/html (q-values respected), i.e. an agent asking for Markdown.
 */
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let md = -1;
  let html = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (type === "text/markdown") md = Math.max(md, q);
    else if (type === "text/html") html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    // Content negotiation: same URL, Markdown for agents, HTML for browsers.
    if (prefersMarkdown(req.headers.get("accept"))) {
      // Original path rides in the URL (catch-all route); query string is kept.
      const target = new URL("/api/markdown" + (pathname === "/" ? "" : pathname) + search, req.url);
      return NextResponse.rewrite(target);
    }
    const res = NextResponse.next();
    res.headers.append("Vary", "Accept");
    return res;
  }

  const auth = req.headers.get("authorization");
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && password === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Bombay Cafe Map admin"' },
  });
}

export const config = {
  // Everything except Next internals, API routes and files with an extension
  // (llms.txt, sitemap.xml, icons, ...), which have a single representation.
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
