import type { MetadataRoute } from "next";

// AI answer engines are named explicitly: we want to be cited (facts are
// citable with attribution, see /llms.txt), and an explicit allow survives
// a future blanket rule. Admin and API stay out of every index.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: "https://bombaycafemap.com/sitemap.xml",
    host: "https://bombaycafemap.com",
  };
}
