"use client";

import { useEffect, useMemo, useState } from "react";
import {
  aiTurn,
  applyMove,
  capturesForPiece,
  initialBoard,
  legalMoves,
  winner,
  type Board,
  type Move,
  type Player,
} from "@/core/games/checkers";
import { cn } from "@/core/utils/cn";
import { useT } from "@/hooks/use-translations";

export function CheckersApp() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<Player>("r");
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [chaining, setChaining] = useState(false);
  const [vsAI, setVsAI] = useState(true);
  const t = useT();

  const win = winner(board, turn);
  const thinking = vsAI && turn === "b" && !win;

  useEffect(() => {
    if (!thinking) return;
    const id = window.setTimeout(() => {
      const next = aiTurn(board, "b");
      if (next) {
        setBoard(next);
        setTurn("r");
        setSelected(null);
        setChaining(false);
      }
    }, 350);
    return () => window.clearTimeout(id);
  }, [thinking, board]);

  const targets = useMemo<Move[]>(() => {
    if (!selected) return [];
    const source = chaining
      ? capturesForPiece(board, selected.r, selected.c)
      : legalMoves(board, turn).filter(
          (m) => m.fromR === selected.r && m.fromC === selected.c,
        );
    return source;
  }, [board, turn, selected, chaining]);

  const reset = () => {
    setBoard(initialBoard());
    setTurn("r");
    setSelected(null);
    setChaining(false);
  };

  const move = (target: Move) => {
    const next = applyMove(board, target);
    if (
      target.captured &&
      capturesForPiece(next, target.toR, target.toC).length
    ) {
      setBoard(next);
      setSelected({ r: target.toR, c: target.toC });
      setChaining(true);
      return;
    }
    setBoard(next);
    setTurn(turn === "r" ? "b" : "r");
    setSelected(null);
    setChaining(false);
  };

  const onSquare = (r: number, c: number) => {
    if (win || thinking) return;
    const target = targets.find((m) => m.toR === r && m.toC === c);
    if (target) {
      move(target);
      return;
    }
    if (chaining) return;
    if (board[r]?.[c]?.color === turn) setSelected({ r, c });
  };

  return (
    <div className="flex h-full flex-col items-center gap-3 overflow-auto bg-[#ece9d8] p-3 text-black select-none">
      <div className="flex flex-wrap items-center justify-center gap-2 text-[12px]">
        <span className="font-bold">
          {win
            ? win === "r"
              ? t("chk.winRed")
              : t("chk.winBlack")
            : thinking
              ? t("chk.thinking")
              : turn === "r"
                ? t("chk.turnRed")
                : t("chk.turnBlack")}
        </span>
        <button
          type="button"
          onClick={() => {
            setVsAI((value) => !value);
            reset();
          }}
          className={cn(
            "rounded-[3px] border border-[#003c74] px-2 py-1 text-[11px]",
            vsAI
              ? "bg-gradient-to-b from-[#cfe0ff] to-[#a9c6f5]"
              : "bg-gradient-to-b from-white to-[#ecebe5]",
          )}
        >
          {vsAI ? t("chk.vsAI") : t("chk.twoPlayers")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2 py-1 text-[11px]"
        >
          {t("chk.new")}
        </button>
      </div>
      <div className="grid grid-cols-8 border-2 border-[#5a3d24]">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const dark = (r + c) % 2 === 1;
            const isTarget = targets.some((m) => m.toR === r && m.toC === c);
            const isSelected = selected?.r === r && selected?.c === c;
            return (
              <button
                key={`${r}:${c}`}
                type="button"
                onClick={() => onSquare(r, c)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center @sm:h-11 @sm:w-11",
                  dark ? "bg-[#7a5636]" : "bg-[#e9e4d3]",
                )}
              >
                {piece && (
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[13px] @sm:h-9 @sm:w-9",
                      piece.color === "r"
                        ? "bg-gradient-to-b from-[#ff7a63] to-[#c1281f] text-white"
                        : "bg-gradient-to-b from-[#4a4a4a] to-[#111] text-white",
                      isSelected && "ring-2 ring-[#f7d94e]",
                    )}
                  >
                    {piece.king ? "♛" : ""}
                  </span>
                )}
                {!piece && isTarget && (
                  <span className="h-3 w-3 rounded-full bg-[#f7d94e]/80" />
                )}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-[11px] text-[#4a4a3a]">{t("chk.hint")}</p>
    </div>
  );
}
