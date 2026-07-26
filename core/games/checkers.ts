export type Player = "r" | "b";

export interface Piece {
  color: Player;
  king: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Move {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  captured?: { r: number; c: number };
}

const SIZE = 8;

export function initialBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => null),
  );
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if ((r + c) % 2 !== 1) continue;
      if (r < 3) board[r]![c] = { color: "b", king: false };
      else if (r > 4) board[r]![c] = { color: "r", king: false };
    }
  }
  return board;
}

function inside(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function directions(piece: Piece): number[] {
  if (piece.king) return [-1, 1];
  return piece.color === "r" ? [-1] : [1];
}

export function movesForPiece(board: Board, r: number, c: number): Move[] {
  const piece = board[r]?.[c];
  if (!piece) return [];
  const moves: Move[] = [];
  for (const dr of directions(piece)) {
    for (const dc of [-1, 1]) {
      const sr = r + dr;
      const sc = c + dc;
      if (inside(sr, sc) && !board[sr]?.[sc]) {
        moves.push({ fromR: r, fromC: c, toR: sr, toC: sc });
      }
    }
  }
  return [...capturesForPiece(board, r, c), ...moves];
}

export function capturesForPiece(board: Board, r: number, c: number): Move[] {
  const piece = board[r]?.[c];
  if (!piece) return [];
  const moves: Move[] = [];
  for (const dr of directions(piece)) {
    for (const dc of [-1, 1]) {
      const mr = r + dr;
      const mc = c + dc;
      const jr = r + 2 * dr;
      const jc = c + 2 * dc;
      const mid = inside(mr, mc) ? (board[mr]?.[mc] ?? null) : null;
      if (
        inside(jr, jc) &&
        !board[jr]?.[jc] &&
        mid &&
        mid.color !== piece.color
      ) {
        moves.push({
          fromR: r,
          fromC: c,
          toR: jr,
          toC: jc,
          captured: { r: mr, c: mc },
        });
      }
    }
  }
  return moves;
}

export function allCaptures(board: Board, player: Player): Move[] {
  const moves: Move[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r]?.[c]?.color === player) {
        moves.push(...capturesForPiece(board, r, c));
      }
    }
  }
  return moves;
}

export function legalMoves(board: Board, player: Player): Move[] {
  const captures = allCaptures(board, player);
  if (captures.length) return captures;
  const moves: Move[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r]?.[c]?.color === player) {
        moves.push(...movesForPiece(board, r, c));
      }
    }
  }
  return moves;
}

export function applyMove(board: Board, move: Move): Board {
  const next = board.map((row) => row.map((sq) => (sq ? { ...sq } : null)));
  const piece = next[move.fromR]![move.fromC]!;
  next[move.fromR]![move.fromC] = null;
  if (move.captured) next[move.captured.r]![move.captured.c] = null;
  const crowned =
    (piece.color === "r" && move.toR === 0) ||
    (piece.color === "b" && move.toR === SIZE - 1);
  next[move.toR]![move.toC] = {
    color: piece.color,
    king: piece.king || crowned,
  };
  return next;
}

export function winner(board: Board, turn: Player): Player | null {
  const opponent: Player = turn === "r" ? "b" : "r";
  const hasPieces = board.flat().some((sq) => sq?.color === turn);
  if (!hasPieces) return opponent;
  if (legalMoves(board, turn).length === 0) return opponent;
  return null;
}
