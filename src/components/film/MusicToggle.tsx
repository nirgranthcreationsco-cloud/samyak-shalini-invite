"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { MUSIC_PREF_KEY } from "@/lib/film/types";

type Props = {
  musicUrl?: string;
  gold: string;
};

/** Soft default — music is opt-in, never loud. */
const DEFAULT_VOLUME = 0.28;

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
    const raw = localStorage.getItem(MUSIC_PREF_KEY);
    if (raw === "1") memoryPref = true;
    else if (raw === "0") memoryPref = false;
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
    const audio = audioRef.current;
    audio.volume = DEFAULT_VOLUME;
    const next = !unmuted;
    if (next) {
      audio.muted = false;
      try {
        await audio.play();
        startedRef.current = true;
        setPref(true);
      } catch {
        setPref(false);
      }
    } else {
      audio.pause();
      audio.muted = true;
      setPref(false);
    }
  }, [musicUrl, unmuted]);

  useEffect(() => {
    if (!musicUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = DEFAULT_VOLUME;
    audio.muted = !unmuted;
    if (unmuted) {
      void audio.play().then(() => {
        startedRef.current = true;
      }).catch(() => setPref(false));
    } else {
      audio.pause();
    }
  }, [unmuted, musicUrl]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="metadata" />
      <button
        type="button"
        onClick={() => void toggle()}
        className="fixed left-3 top-3 z-50 flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-[11px] tracking-[0.14em] uppercase backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          borderColor: `${gold}55`,
          color: unmuted ? "#5A0F2B" : "#8A6A1F",
          background: "rgba(247,241,230,0.92)",
          outlineColor: gold,
          opacity: unmuted ? 0.95 : 0.72,
        }}
        aria-pressed={unmuted}
        aria-label={unmuted ? "Mute music" : "Play soft music"}
        title={unmuted ? "Mute" : "Play soft music"}
      >
        <span aria-hidden="true">{unmuted ? "♪" : "♩"}</span>
        <span>{unmuted ? "On" : "Music"}</span>
      </button>
    </>
  );
}
