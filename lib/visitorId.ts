const KEY = "bcm_visitor_id";

/**
 * A random id persisted in this browser, used only to let someone change or
 * retract their own vote and to rate-limit their own comments. Not a real
 * identity check — clearing storage gets a fresh one — but that's an
 * acceptable ceiling for a small site's vote/comment feature, not a
 * security boundary.
 */
export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Private browsing / storage blocked: fall back to a per-load id rather
    // than throwing, since voting still works, it just won't be remembered.
    return crypto.randomUUID();
  }
}
