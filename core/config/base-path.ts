// next/image and next/link apply the base path themselves; raw URLs (CSS url(), Audio, <a href>)
// do not, so they go through asset().
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
