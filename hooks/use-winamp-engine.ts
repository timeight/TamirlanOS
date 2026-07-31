"use client";

import { useEffect, useRef } from "react";
import {
  ensureGraph,
  seekTo,
  setBalance,
  setVolume,
  unlock,
} from "@/core/audio/playback-engine";
import { RepeatMode, useWinampStore } from "@/stores/winamp-store";

export interface WinampEngine {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  seek: (seconds: number) => void;
}

/**
 * Binds the store to a single <audio> element and the Web Audio graph. The UI
 * never touches the element directly, so playback state has one owner.
 */
export function useWinampEngine(): WinampEngine {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playing = useWinampStore((state) => state.playing);
  const currentId = useWinampStore((state) => state.currentId);
  const volume = useWinampStore((state) => state.volume);
  const balance = useWinampStore((state) => state.balance);

  const track = useWinampStore((state) =>
    state.playlist.find((item) => item.id === state.currentId),
  );

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    ensureGraph(element);
    setVolume(useWinampStore.getState().volume);
  }, []);

  useEffect(() => setVolume(volume), [volume]);
  useEffect(() => setBalance(balance), [balance]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element || !track?.src) return;
    if (element.src !== track.src) {
      element.src = track.src;
      element.load();
    }
  }, [track?.src, currentId]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    if (!playing) {
      element.pause();
      return;
    }
    void unlock().then(() => element.play().catch(() => undefined));
  }, [playing, currentId]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;

    const onTime = () =>
      useWinampStore.getState().setPosition(element.currentTime);
    const onMeta = () => {
      const id = useWinampStore.getState().currentId;
      if (id) useWinampStore.getState().setDuration(id, element.duration);
    };
    const onEnded = () => {
      const store = useWinampStore.getState();
      if (store.repeat === RepeatMode.One) {
        void seekTo(0);
        void element.play().catch(() => undefined);
        return;
      }
      const last =
        store.playlist.findIndex((item) => item.id === store.currentId) ===
        store.playlist.length - 1;
      if (last && store.repeat === RepeatMode.Off && !store.shuffle) {
        store.setPlaying(false);
        return;
      }
      store.step(1);
    };

    element.addEventListener("timeupdate", onTime);
    element.addEventListener("loadedmetadata", onMeta);
    element.addEventListener("ended", onEnded);
    return () => {
      element.removeEventListener("timeupdate", onTime);
      element.removeEventListener("loadedmetadata", onMeta);
      element.removeEventListener("ended", onEnded);
    };
  }, []);

  return { audioRef, seek: (seconds) => void seekTo(seconds) };
}
