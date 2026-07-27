export type Grid = number[][];
export type Direction = "left" | "right" | "up" | "down";

export interface Game {
  grid: Grid;
  score: number;
  won: boolean;
  over: boolean;
}

const SIZE = 4;

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => 0),
  );
}

function spawn(grid: Grid): void {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] === 0) empty.push([r, c]);
    }
  }
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]!;
  grid[r]![c] = Math.random() < 0.9 ? 2 : 4;
}

export function createGame(): Game {
  const grid = emptyGrid();
  spawn(grid);
  spawn(grid);
  return { grid, score: 0, won: false, over: false };
}

function slide(row: number[]): { row: number[]; gained: number; won: boolean } {
  const tiles = row.filter((value) => value !== 0);
  const result: number[] = [];
  let gained = 0;
  let won = false;
  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const merged = tiles[i]! * 2;
      result.push(merged);
      gained += merged;
      if (merged === 2048) won = true;
      i++;
    } else {
      result.push(tiles[i]!);
    }
  }
  while (result.length < SIZE) result.push(0);
  return { row: result, gained, won };
}

function clone(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

function transpose(grid: Grid): Grid {
  const out = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) out[c]![r] = grid[r]![c]!;
  }
  return out;
}

function reverseRows(grid: Grid): Grid {
  return grid.map((row) => [...row].reverse());
}

function equal(a: Grid, b: Grid): boolean {
  return a.every((row, r) => row.every((value, c) => value === b[r]![c]));
}

function hasMoves(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] === 0) return true;
      if (c + 1 < SIZE && grid[r]![c] === grid[r]![c + 1]) return true;
      if (r + 1 < SIZE && grid[r]![c] === grid[r + 1]![c]) return true;
    }
  }
  return false;
}

export function move(game: Game, dir: Direction): Game {
  if (game.over) return game;

  const orient = (grid: Grid): Grid => {
    if (dir === "right") return reverseRows(grid);
    if (dir === "up") return transpose(grid);
    if (dir === "down") return reverseRows(transpose(grid));
    return grid;
  };
  const restore = (grid: Grid): Grid => {
    if (dir === "right") return reverseRows(grid);
    if (dir === "up") return transpose(grid);
    if (dir === "down") return transpose(reverseRows(grid));
    return grid;
  };

  let gained = 0;
  let won = false;
  const slid = orient(clone(game.grid)).map((row) => {
    const result = slide(row);
    gained += result.gained;
    if (result.won) won = true;
    return result.row;
  });
  const next = restore(slid);

  if (equal(next, game.grid)) return game;
  spawn(next);
  return {
    grid: next,
    score: game.score + gained,
    won: game.won || won,
    over: !hasMoves(next),
  };
}
