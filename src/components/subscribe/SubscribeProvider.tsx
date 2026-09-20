"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SubscribeModal } from "./SubscribeModal";

type SubscriberSummary = { name: string; email: string };
type SubscribeContextValue = {
  subscriber: SubscriberSummary | null;
  open: (onDone?: () => void) => void;
  close: () => void;
  refresh: () => Promise<void>;
};

const SubscribeContext = createContext<SubscribeContextValue | null>(null);

export function SubscribeProvider({ children }: { children: React.ReactNode }) {
  const [subscriber, setSubscriber] = useState<SubscriberSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onDone, setOnDone] = useState<(() => void) | undefined>();

  const refresh = async () => {
    const response = await fetch("/api/me", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { subscriber: SubscriberSummary | null };
    setSubscriber(data.subscriber);
  };

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/me", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { subscriber: SubscriberSummary | null } | null) => {
        if (!cancelled && data) setSubscriber(data.subscriber);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      subscriber,
      open: (done?: () => void) => {
        setOnDone(() => done);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
        setOnDone(undefined);
      },
      refresh,
    }),
    [subscriber],
  );

  return (
    <SubscribeContext.Provider value={value}>
      {children}
      <SubscribeModal
        open={isOpen}
        onClose={() => value.close()}
        onDone={() => {
          void refresh();
          onDone?.();
        }}
      />
    </SubscribeContext.Provider>
  );
}

export function useSubscribe() {
  const value = useContext(SubscribeContext);
  if (!value) throw new Error("useSubscribe must be used within SubscribeProvider");
  return value;
}
