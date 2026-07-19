"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "tamirlanos-ideas";

export function IdeasApp() {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setText(window.localStorage.getItem(STORAGE_KEY) ?? "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current !== undefined) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, text);
    }, 300);
    return () => {
      if (saveTimer.current !== undefined) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [text, loaded]);

  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <p className="text-[13px] font-bold text-[#003399]">Ideas</p>
        <p className="text-[#4a5a70]">
          A personal notebook. Notes save automatically and stay on this
          computer.
        </p>
      </div>
      <label htmlFor="ideas-notebook" className="sr-only">
        Notebook
      </label>
      <textarea
        id="ideas-notebook"
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        placeholder="Write something worth building..."
        className="flex-1 resize-none p-3 font-mono text-[12px] leading-5 outline-none placeholder:text-[#9aa7b8]"
      />
    </div>
  );
}
