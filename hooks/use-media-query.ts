"use client";

import { useEffect, useState } from "react";

/**
 * Viewport width is the only signal: a narrow desktop window should get the
 * same layout as a phone, and a user agent string cannot tell us that.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
