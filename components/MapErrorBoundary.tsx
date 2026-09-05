"use client";

import { Component, type ReactNode } from "react";

/**
 * MapView and the cafe list are siblings under one screen — without this,
 * an uncaught error inside MapLibre's render loop (a bad style response, a
 * WebGL context loss mid-session) unmounts the whole screen, taking the
 * still-functional cafe list down with it. This isolates that failure to
 * the map panel alone.
 */
export default class MapErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Map failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid h-full w-full place-items-center bg-ink px-6 text-center">
          <div>
            <p className="wa-mono text-paper/50">The map couldn&apos;t load in this browser.</p>
            <p className="mt-1.5 text-[13px] text-paper/35">
              The cafe list alongside it still works — pick a cafe there instead.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
