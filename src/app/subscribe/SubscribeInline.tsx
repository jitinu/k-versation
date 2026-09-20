"use client";

import { useState } from "react";
import { SubscribeForm } from "@/components/subscribe/SubscribeForm";
import { useSubscribe } from "@/components/subscribe/SubscribeProvider";

export function SubscribeInline() {
  const { refresh } = useSubscribe();
  const [success, setSuccess] = useState("");
  if (success) {
    return <p className="font-display text-3xl normal-case">You&apos;re in, {success}.</p>;
  }
  return (
    <SubscribeForm
      onSuccess={(name) => {
        setSuccess(name);
        void refresh();
      }}
    />
  );
}
