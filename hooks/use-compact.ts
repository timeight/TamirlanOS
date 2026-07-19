"use client";

import { useEffect, useState } from "react";

// Below this width the desktop metaphor collapses to a single fullscreen window.
const COMPACT_QUERY = "(max-width: 640px)";

export function useIsCompact() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(COMPACT_QUERY);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
}
