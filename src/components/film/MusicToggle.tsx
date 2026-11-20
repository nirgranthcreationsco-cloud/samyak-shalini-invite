"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { MUSIC_PREF_KEY } from "@/lib/film/types";

type Props = {
  musicUrl?: string;
  gold: string;
};

let memoryPref = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getClientPref() {
  try {
    memoryPref = localStorage.getItem(MUSIC_PREF_KEY) === "1";
  } catch {
    // ignore
  }
  return memoryPref;
}

function getServerPref() {
  return false;
}

function setPref(next: boolean) {
  memoryPref = next;
  try {
    localStorage.setItem(MUSIC_PREF_KEY, next ? "1" : "0");
  } catch {
    // ignore
  }
  emit();
}

export function MusicToggle({ musicUrl, gold }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unmuted = useSyncExternalStore(subscribe, getClientPref, getServerPref);
  const startedRef = useRef(false);

  const toggle = useCallback(async () => {
    if (!musicUrl || !audioRef.current) return;
    const next = !unmuted;
    if (next) {
      audioRef.current.muted = false;
      try {
        await audioRef.current.play();
        startedRef.current = true;
        setPref(true);
      } catch {
        setPref(false);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.muted = true;
      setPref(false);
    }
  }, [musicUrl, unmuted]);

  useEffect(() => {
    if (!musicUrl || !audioRef.current) return;
    audioRef.current.muted = !unmuted;
    if (unmuted && startedRef.current) {
      void audioRef.current.play().catch(() => setPref(false));
    }
  }, [unmuted, musicUrl]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        onClick={() => void toggle()}
        className="fixed left-3 top-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border text-sm backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          borderColor: `${gold}66`,
          color: "#8A6A1F",
          background: "rgba(247,241,230,0.9)",
          outlineColor: gold,
        }}
        aria-pressed={unmuted}
        aria-label={unmuted ? "Mute music" : "Play music"}
      >
        ♪
      </button>
    </>
  );
}
