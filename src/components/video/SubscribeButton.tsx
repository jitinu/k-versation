"use client";
import { useState } from "react";
import { useRequireAuth } from "@/components/auth/AuthGate";
export function SubscribeButton() {
  const gate = useRequireAuth();
  const [subscribed, setSubscribed] = useState(false);
  return (
    <button
      className="border-signal text-signal border px-4 py-3"
      onClick={() => gate(() => setSubscribed(!subscribed))}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
