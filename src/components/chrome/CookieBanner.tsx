"use client";
import { useSyncExternalStore } from "react";

const KEY = "kv-consent";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function getSnapshot() {
  return localStorage.getItem(KEY) === "yes";
}
function accept() {
  localStorage.setItem(KEY, "yes");
  listeners.forEach((listener) => listener());
}

export function CookieBanner() {
  const accepted = useSyncExternalStore(subscribe, getSnapshot, () => true);
  if (accepted) return null;
  return (
    <aside className="border-signal bg-canvas fixed bottom-4 left-4 z-50 max-w-sm border p-4 text-xs">
      <p className="normal-case">
        We use essential cookies and privacy-friendly analytics to keep K-VERSATION running.
      </p>
      <button className="border-signal text-signal mt-4 border px-3 py-2" onClick={accept}>
        Accept
      </button>
    </aside>
  );
}
