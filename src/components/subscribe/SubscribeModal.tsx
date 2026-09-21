"use client";

import { useEffect, useRef, useState } from "react";
import { SubscribeForm } from "./SubscribeForm";

export function SubscribeModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [success, setSuccess] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("input")?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      setSuccess("");
      onDone();
      onClose();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [success, onClose, onDone]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#080807]/80 px-4 py-8 md:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-title"
        data-lenis-prevent
        className="bg-canvas text-ink max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[var(--radius-media)] p-6 md:p-10"
      >
        {success ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <p className="eyebrow">Welcome aboard</p>
            <p className="font-display mt-5 text-4xl normal-case">You&apos;re in, {success}.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">Join the list</p>
                <h2 id="subscribe-title" className="font-display mt-4 text-3xl normal-case md:text-4xl">
                  Get every new conversation.
                </h2>
              </div>
              <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={onClose}>
                Close
              </button>
            </div>
            <SubscribeForm onSuccess={setSuccess} />
          </>
        )}
      </div>
    </div>
  );
}
