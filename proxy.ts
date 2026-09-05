import { NextRequest, NextResponse } from "next/server";

/**
 * The only thing gating the review queue from the public internet. No
 * accounts system exists (or is warranted) for a single reviewer, so this
 * is deliberately just HTTP Basic Auth against two env vars rather than a
 * built-out auth stack.
 */
export function proxy(req: NextRequest) {
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
  matcher: ["/admin/:path*"],
};
