"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

// Below this width the desktop metaphor collapses to a single fullscreen window.
const COMPACT_QUERY = "(max-width: 640px)";

export function useIsCompact() {
  return useMediaQuery(COMPACT_QUERY);
}
