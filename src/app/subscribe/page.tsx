import type { Metadata } from "next";
import { SubscribeInline } from "./SubscribeInline";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Join the K-VERSATION list for every new conversation.",
};

export default function SubscribePage() {
  return (
    <div data-theme="ivory" className="page section-gap mx-auto max-w-xl">
      <p className="eyebrow">Join the list</p>
      <h1 className="font-display mt-6 text-5xl tracking-[-0.03em] normal-case md:text-7xl">
        Get every new conversation.
      </h1>
      <p className="text-ink-2 mt-8 max-w-md text-lg normal-case">
        Subscribe for new episodes, thoughtful conversations, and notes from Daniel.
      </p>
      <div className="mt-10">
        <SubscribeInline />
      </div>
    </div>
  );
}
