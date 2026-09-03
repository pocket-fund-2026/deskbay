"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/**
 * The theme lives in the DOM (`data-theme` on <html>), set before paint by the
 * inline script in the layout, not in React state — so React subscribes to it
 * rather than owning it. That keeps the toggle and the map reading one source,
 * and means a change made anywhere reaches both.
 *
 * No `data-theme` attribute means the visitor has never chosen, so the system
 * preference decides and keeps deciding.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "dark" || chosen === "light") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** The server cannot know; it renders light and the client corrects on mount. */
function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode; the choice just won't outlive the session */
  }
}
