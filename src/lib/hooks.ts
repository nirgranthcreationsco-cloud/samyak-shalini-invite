"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function subscribeVisibility(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);
  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getVisibilitySnapshot() {
  return document.visibilityState === "visible";
}

function getVisibilityServerSnapshot() {
  return true;
}

export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot
  );
}

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const INTRO_KEY = "wedding-invite-intro-seen";
const ENVELOPE_KEY = "wedding-invite-envelope-seen";

export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasSeenEnvelope(): boolean {
  try {
    return sessionStorage.getItem(ENVELOPE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markEnvelopeSeen(): void {
  try {
    sessionStorage.setItem(ENVELOPE_KEY, "1");
  } catch {
    // ignore
  }
}

export const DRAFT_KEY = "wedding-invite-draft";
