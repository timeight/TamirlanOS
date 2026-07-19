"use client";

import { useEffect } from "react";
import { WindowFrame } from "@/components/window/WindowFrame";
import { useWindowStore } from "@/stores/window-store";

export function WindowManager() {
  const zOrder = useWindowStore((store) => store.zOrder);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "F4") {
        event.preventDefault();
        const { focusedId, closeWindow } = useWindowStore.getState();
        if (focusedId) closeWindow(focusedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {zOrder.map((id, index) => (
        <WindowFrame key={id} id={id} zIndex={index} />
      ))}
    </>
  );
}
