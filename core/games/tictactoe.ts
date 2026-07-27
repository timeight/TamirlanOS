export type Mark = "X" | "O";
export type Cell = Mark | null;
export type Board = Cell[];

const LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function winnerTTT(board: Board): Mark | "draw" | null {
  for (const [a, b, c] of LINES) {
    const value = board[a];
    if (value && value === board[b] && value === board[c]) return value;
  }
  return board.every((cell) => cell) ? "draw" : null;
}

function minimax(board: Board, player: Mark, ai: Mark, depth: number): number {
  const result = winnerTTT(board);
  if (result) {
    if (result === "draw") return 0;
    return result === ai ? 10 - depth : depth - 10;
  }
  const opponent: Mark = player === "X" ? "O" : "X";
  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = player;
      scores.push(minimax(board, opponent, ai, depth + 1));
      board[i] = null;
    }
  }
  return player === ai ? Math.max(...scores) : Math.min(...scores);
}

export function bestMoveTTT(board: Board, ai: Mark): number {
  const work = [...board];
  const opponent: Mark = ai === "X" ? "O" : "X";
  let best = -Infinity;
  let bestIndex = -1;
  for (let i = 0; i < 9; i++) {
    if (!work[i]) {
      work[i] = ai;
      const score = minimax(work, opponent, ai, 1);
      work[i] = null;
      if (score > best) {
        best = score;
        bestIndex = i;
      }
    }
  }
  return bestIndex;
}
