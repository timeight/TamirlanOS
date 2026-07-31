/** Every route that can reveal the archive. The clue copy lives in i18n. */
export enum DiscoverySource {
  Pix = "pix",
  Agent = "agent",
  HiddenFile = "hidden-file",
  System32 = "system32",
  Achievement = "achievement",
  Command = "command",
  Drift = "drift",
}

/** Translation key for the line shown next to "Hidden files detected". */
export function clueKey(source: DiscoverySource): string {
  return `lost.clue.${source}`;
}

/**
 * A slow-burn counter: curiosity anywhere in the OS eventually surfaces the
 * archive on its own, so nobody who explores thoroughly is locked out.
 */
export const DRIFT_THRESHOLD = 8;

/** The secret typed anywhere on the desktop. */
export const UNLOCK_PHRASE = "lostfiles";

export function matchesPhrase(buffer: string): boolean {
  return buffer.toLowerCase().endsWith(UNLOCK_PHRASE);
}
