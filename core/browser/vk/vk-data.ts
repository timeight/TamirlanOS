/** Russian needs three forms; a bare "N комментариев" reads wrong at 1 and 2. */
export function pluralComments(count: number): string {
  const tail = count % 100;
  if (tail >= 11 && tail <= 14) return `${count} комментариев`;
  const last = count % 10;
  if (last === 1) return `${count} комментарий`;
  if (last >= 2 && last <= 4) return `${count} комментария`;
  return `${count} комментариев`;
}
