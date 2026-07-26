export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  mine: boolean;
  adjacent: number;
  state: CellState;
}

export type GameState = "playing" | "won" | "lost";

export interface Board {
  rows: number;
  cols: number;
  mines: number;
  started: boolean;
  state: GameState;
  cells: Cell[][];
}

export function createBoard(rows: number, cols: number, mines: number): Board {
  const cells = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      adjacent: 0,
      state: "hidden" as CellState,
    })),
  );
  return { rows, cols, mines, started: false, state: "playing", cells };
}

function clone(board: Board): Board {
  return {
    ...board,
    cells: board.cells.map((row) => row.map((cell) => ({ ...cell }))),
  };
}

function neighbors(board: Board, r: number, c: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < board.rows && nc >= 0 && nc < board.cols) {
        result.push([nr, nc]);
      }
    }
  }
  return result;
}

function placeMines(board: Board, safeR: number, safeC: number): void {
  const forbidden = new Set(
    [[safeR, safeC], ...neighbors(board, safeR, safeC)].map(
      ([r, c]) => `${r}:${c}`,
    ),
  );
  let placed = 0;
  while (placed < board.mines) {
    const r = Math.floor(Math.random() * board.rows);
    const c = Math.floor(Math.random() * board.cols);
    const cell = board.cells[r]![c]!;
    if (forbidden.has(`${r}:${c}`) || cell.mine) continue;
    cell.mine = true;
    placed++;
  }
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      board.cells[r]![c]!.adjacent = neighbors(board, r, c).filter(
        ([nr, nc]) => board.cells[nr]![nc]!.mine,
      ).length;
    }
  }
  board.started = true;
}

function floodReveal(board: Board, r: number, c: number): void {
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = board.cells[cr]?.[cc];
    if (!cell || cell.state !== "hidden" || cell.mine) continue;
    cell.state = "revealed";
    if (cell.adjacent === 0) {
      for (const [nr, nc] of neighbors(board, cr, cc)) stack.push([nr, nc]);
    }
  }
}

function checkWin(board: Board): void {
  const safeHidden = board.cells
    .flat()
    .some((cell) => !cell.mine && cell.state !== "revealed");
  if (!safeHidden) {
    board.state = "won";
    board.cells.flat().forEach((cell) => {
      if (cell.mine) cell.state = "flagged";
    });
  }
}

export function reveal(board: Board, r: number, c: number): Board {
  if (board.state !== "playing") return board;
  const existing = board.cells[r]?.[c];
  if (!existing || existing.state !== "hidden") return board;
  const next = clone(board);
  if (!next.started) placeMines(next, r, c);
  const target = next.cells[r]![c]!;
  if (target.mine) {
    next.state = "lost";
    next.cells.flat().forEach((cell) => {
      if (cell.mine) cell.state = "revealed";
    });
    return next;
  }
  floodReveal(next, r, c);
  checkWin(next);
  return next;
}

export function toggleFlag(board: Board, r: number, c: number): Board {
  if (board.state !== "playing") return board;
  const cell = board.cells[r]?.[c];
  if (!cell || cell.state === "revealed") return board;
  const next = clone(board);
  next.cells[r]![c]!.state = cell.state === "flagged" ? "hidden" : "flagged";
  return next;
}

export function minesLeft(board: Board): number {
  const flags = board.cells.flat().filter((c) => c.state === "flagged").length;
  return board.mines - flags;
}
